import * as Notifications from 'expo-notifications';

/**
 * Global Notification Handler Configuration
 * Determines how the app behaves when a notification is received
 * while the app is in the foreground.
 */
export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldShowWhenLocked: true,
    }),
  });
};
