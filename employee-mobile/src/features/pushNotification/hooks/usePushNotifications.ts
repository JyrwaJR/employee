import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Route, router } from 'expo-router';
import { PushNotificationService } from '../services';
import { logger } from '@/src/shared/utils/logger';
import { isExpoGo } from '@/src/shared/constants';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { notify } from '@/src/shared/utils/notify';

/**
 * Whitelist of permitted internal routes for push-triggered navigation.
 * Prevents unauthorized redirection to sensitive or spoofed screens.
 */
const ALLOWED_PUSH_ROUTES = ['/salary/payslip', '/employees/details', '/(tabs)/profile', '/profile'];

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

  // Secure navigation helper
  const handleNavigation = (url: string) => {
    const isAllowed = ALLOWED_PUSH_ROUTES.some((route) => url.startsWith(route));
    if (isAllowed) {
      router.push(url as Route);
    } else {
      logger.warn(`PushNotificationHook: Blocked unauthorized redirect to ${url}`);
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
        const token = await PushNotificationService.regPushToken({
          userId: user?.id.toString() ?? '',
        });
        
        if (isMounted && token && Platform.OS === 'android') {
          await Notifications.getNotificationChannelsAsync();
        }
      } catch (error) {
        logger.error('PushNotificationHook: Registration failed:', error);
      }
    };

    register();

    // 1. Handle Foreground Notifications (App is open)
    const notificationListener = Notifications.addNotificationReceivedListener((notif) => {
      if (isMounted) {
        setNotification(notif);
        
        // Display branded in-app toast for immediate feedback
        notify(
          { 
            success: true, 
            message: notif.request.content.body || 'New update received' 
          }, 
          'PUSH_SYSTEM'
        );
      }
    });

    // 2. Handle Notification Interaction (App in background/tray tap)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // NOTE: This listener handles interactions while the app is already running (Foreground/Background).
      // Initial interaction on cold start is handled by the useLastNotificationResponse hook above.
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
