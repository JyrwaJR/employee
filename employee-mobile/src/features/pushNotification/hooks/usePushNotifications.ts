import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Route, router } from 'expo-router';
import { PushNotificationService } from '../services';
import { logger } from '@/src/shared/utils/logger';
import { isExpoGo } from '@/src/shared/constants';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { notify } from '@/src/shared/utils/notify';
import { withRetry } from '@/src/shared/utils/retry';
import { routes } from '@/src/shared/constants/routes';

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
 * Custom Hook for Push Notification Lifecycle
 * Handles registration, foreground listeners, and deep-linking interactions.
 */
export const usePushNotifications = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const lastResponse = Notifications.useLastNotificationResponse();

  // Secure navigation helper with fallback
  const handleNavigation = (url: string) => {
    const isAllowed = ALLOWED_PUSH_ROUTES.some((route) => url.startsWith(route));

    if (isAllowed) {
      logger.info(`PushNotificationHook: Navigating to ${url}`);
      router.push(url as Route);
    } else {
      logger.warn(
        `PushNotificationHook: Blocked unauthorized or invalid redirect to [${url}]. Falling back to safe route.`
      );
      // Production fallback: Redirect to a safe default instead of failing silently
      router.push(routes.profile as Route);
    }
  };

  // Handle Response/Launch from lastResponse hook
  useEffect(() => {
    if (lastResponse?.notification) {
      const url = lastResponse.notification.request.content.data?.url;
      if (typeof url === 'string') {
        handleNavigation(url);
      }
    }
  }, [lastResponse]);

  useEffect(() => {
    // Skip registration if in Expo Go without a user
    if (isExpoGo && !user) return;

    let isMounted = true;

    const register = async () => {
      try {
        // Elite Pattern: Use exponential backoff for registration retries (e.g. offline on launch)
        const result = await withRetry(
          async () => {
            return await PushNotificationService.regPushToken({
              userId: user?.id.toString() || '',
            });
          },
          {
            maxRetries: 3,
            onRetry: (err) => logger.warn('PushNotificationHook: Registration attempt failed', err),
          }
        );

        if (isMounted && typeof result === 'string' && Platform.OS === 'android') {
          await Notifications.getNotificationChannelsAsync();
          logger.info('PushNotificationHook: Registration & Channel Sync Complete');
        }
      } catch (error) {
        // Fatal after all retries
        logger.error(
          'PushNotificationHook: Registration permanently failed after backoff retries.',
          error
        );
      }
    };

    register();

    // 1. Handle Foreground Notifications (App is open)
    const notificationListener = Notifications.addNotificationReceivedListener((notif) => {
      if (isMounted) {
        setNotification(notif);

        // Telemetry
        logger.info('PushNotificationHook: [NOTIF_RECEIVED] Foreground notification arrived', {
          id: notif.request.identifier,
          title: notif.request.content.title,
        });

        // Display branded in-app toast for immediate feedback
        notify(
          {
            success: true,
            message: notif.request.content.body || 'New update received',
          },
          'PUSH_SYSTEM'
        );
      }
    });

    // 2. Handle Notification Interaction (App in background/tray tap)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // Telemetry
      logger.info('PushNotificationHook: [NOTIF_OPENED] User tapped on notification', {
        id: response.notification.request.identifier,
        action: response.actionIdentifier,
      });

      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') {
        handleNavigation(url);
      }
    });

    // Note: Cold start logic migrated to useLastNotificationResponse hook above

    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, [user]);

  return {
    notification,
  };
};
