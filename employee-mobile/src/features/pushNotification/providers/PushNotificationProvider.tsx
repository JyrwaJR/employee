import React from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { configureNotificationHandler } from '../utils/notification-handler';

type Props = {
  children: React.ReactNode;
};

/**
 * Global Notification Configuration
 * Initialized once at the provider level to manage
 * sound, banners, and foreground behavior.
 */
configureNotificationHandler();

/**
 * Clean UI Wrapper for Push Notifications
 * Uses the custom hook to manage registration and deep-linking.
 */
export const PushNotificationProvider = ({ children }: Props) => {
  // Notification lifecycle logic extracted to custom hook
  usePushNotifications();

  return <React.Fragment>{children}</React.Fragment>;
};
