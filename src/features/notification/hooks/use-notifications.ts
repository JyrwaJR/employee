import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Route, router } from 'expo-router';
import { logger } from '@utils/logger/logger';
import { useAuthStore } from '@stores/auth.store';
import { toast } from '@components/ui';
import { withRetry } from '@utils/helpers/retry';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { NotificationService } from '@services/notification.service';
import { isExpo } from '@utils/helpers/expo';

/**
 * Whitelist of permitted internal routes for push-triggered navigation.
 * Prevents unauthorized redirection to sensitive or spoofed screens.
 */
const ALLOWED_PUSH_ROUTES = [
  PAGE_ROUTES.HOME,
  PAGE_ROUTES.STATEMENT,
  PAGE_ROUTES.EMPLOYEES.DETAILS(''),
  PAGE_ROUTES.PROFILE,
];

type PushNotificationData = {
  url?: string;
  employeeId?: string;
  type?: 'leave' | 'salary' | 'announcement';
  imageUrl: string;
};

/**
 * Global Hook for Push Notification lifecycle management.
 * Handles registration, foreground listeners, and deep-linking interactions.
 */
export const useNotifications = () => {
  const { emp_cd } = useAuthStore();
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
      router.push(PAGE_ROUTES.PROFILE as Route);
    }
  };

  useEffect(() => {
    if (lastResponse?.notification) {
      const data = lastResponse.notification.request.content.data as PushNotificationData;
      const url = data?.url;
      const id = lastResponse.notification.request.identifier;

      if (typeof url === 'string') {
        handleNavigation(url, id);
      }
    }
  }, [lastResponse]);

  useEffect(() => {
    if (isExpo() && !emp_cd) return;

    let isMounted = true;

    const register = async () => {
      try {
        await withRetry(
          async () => {
            return await NotificationService.register({
              userId: emp_cd || '',
            });
          },
          {
            maxRetries: 3,
            onRetry: (err) => logger.warn('NotificationHook: Registration attempt failed', err),
          }
        );

        if (isMounted) {
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
      const data = response.notification.request.content.data as PushNotificationData;
      const url = data.url;
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
  }, [emp_cd]);

  return { notification };
};
