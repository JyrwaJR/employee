import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Route, router } from 'expo-router';
import { PushNotificationService } from '@/src/features/pushNotification/services';
import { logger } from '@/src/shared/utils/logger';
import { isExpoGo } from '@/src/shared/constants';
import { useAuth } from '@/src/features/auth/hooks/useAuth';

type Props = {
  children: React.ReactNode;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowWhenLocked: true,
  }),
});

export const PushNotificationProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [_expoPushToken, setExpoPushToken] = useState('');
  const [_channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [_notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    if (isExpoGo && !user) return;

    let isMounted = true;
    // Register for push token
    const register = async () => {
      try {
        const token = await PushNotificationService.regPushToken({
          userId: user?.id.toString() ?? '',
        });
        if (isMounted && token) {
          setExpoPushToken(token);
        }

        if (Platform.OS === 'android') {
          const existingChannels = await Notifications.getNotificationChannelsAsync();
          if (isMounted) {
            setChannels(existingChannels ?? []);
          }
        }
      } catch (error) {
        logger.error('Failed to register for push notifications:', error);
      }
    };

    register();

    // Handle incoming notifications (Foreground)
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      if (isMounted) {
        setNotification(notification);
      }
    });

    // Handle interaction (Tap on notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url as Route);
      }
    });

    const checkInitialNotification = async () => {
      const response = Notifications.getLastNotificationResponse();
      if (isMounted && response?.notification) {
        const url = response.notification.request.content.data?.url;
        if (typeof url === 'string') {
          router.push(url as Route);
        }
      }
    };

    checkInitialNotification();

    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, [user]);

  return <React.Fragment>{children}</React.Fragment>;
};
