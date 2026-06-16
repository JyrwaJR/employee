import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Route, router } from 'expo-router';
import { logger } from '@/src/shared/utils/logger';
import { isExpoGo } from '@/src/shared/constants';
import { useAuth } from '@/src/shared/hooks/use-auth';
import { toast } from '@/src/shared/components/ui';
import { withRetry } from '@/src/shared/utils/retry';
import { routes } from '@/src/shared/constants/routes';
import { NotificationService } from '@/src/shared/services/notification.service';

/**
 * Whitelist of permitted internal routes for push-triggered navigation.
 * Prevents unauthorized redirection to sensitive or spoofed screens.
 */
const ALLOWED_PUSH_ROUTES = [
  routes.home,
  routes.statement,
  routes.employees.details(''),
  routes.profile,
];

/**
 * Global Hook for Push Notification lifecycle management.
 * Handles registration, foreground listeners, and deep-linking interactions.
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const lastResponse = Notifications.useLastNotificationResponse();

  const processedResponseId = useRef<string | null>(null);

  // Secure navigation helper with whitelist validation
  const handleNavigation = (url: string, responseId: string | null = null) => {
    if (responseId && processedResponseId.current === responseId) {
      return;
    }

    if (responseId) {
      processedResponseId.current = responseId;
    }

    const isAllowed = ALLOWED_PUSH_ROUTES.some((route) => url.startsWith(route));

    if (isAllowed) {
      logger.info(`NotificationHook: Navigating to ${url}`, { responseId });
      router.push(url as Route);
    } else {
      logger.warn(`NotificationHook: Blocked unauthorized redirect to [${url}]. Falling back.`);
      router.push(routes.profile as Route);
    }
  };

  useEffect(() => {
    if (lastResponse?.notification) {
      const url = lastResponse.notification.request.content.data?.url;
      const id = lastResponse.notification.request.identifier;

      if (typeof url === 'string') {
        handleNavigation(url, id);
      }
    }
  }, [lastResponse]);

  useEffect(() => {
    if (isExpoGo && !user) return;

    let isMounted = true;

    const register = async () => {
      try {
        await withRetry(
          async () => {
            return await NotificationService.register({
              userId: user?.id.toString() || '',
            });
          },
          {
            maxRetries: 3,
            onRetry: (err) => logger.warn('NotificationHook: Registration attempt failed', err),
          }
        );

        if (isMounted && Platform.OS === 'android') {
          await Notifications.getNotificationChannelsAsync();
          logger.info('NotificationHook: Registration & Channel Sync Complete');
        }
      } catch (error) {
        logger.error('NotificationHook: Registration permanently failed.', error);
      }
    };

    register();

    const notificationListener = Notifications.addNotificationReceivedListener((notif) => {
      if (isMounted) {
        setNotification(notif);
        logger.info('NotificationHook: [RECEIVED] Foreground notification arrived', {
          id: notif.request.identifier,
        });

        toast.success('New Notification', {
          description: notif.request.content.body || 'New message received',
        });
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      const id = response.notification.request.identifier;

      if (id || url) {
        logger.info('NotificationHook: [OPENED] User tapped notification', { id });
        if (typeof url === 'string') {
          handleNavigation(url, id);
        }
      }
    });

    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, [user]);

  return { notification };
};
