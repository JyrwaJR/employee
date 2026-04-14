import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import { logger } from '@/src/shared/utils/logger';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';

export type RegistrationResult = {
  success: boolean;
  token?: string;
  errorType?: 'PERMISSION_DENIED' | 'NOT_A_DEVICE' | 'CONFIG_ERROR' | 'NETWORK_ERROR';
};

/**
 * Service for managing global Push Notification lifecycle.
 * Promoted from features/ to shared/ for universal accessibility.
 */
export const NotificationService = {
  /**
   * Registers the device for push notifications and syncs the token with the backend.
   */
  async register({ userId }: { userId: string }): Promise<RegistrationResult> {
    if (!userId) {
      logger.info('NotificationService: No user id provided');
      return { success: false, errorType: 'CONFIG_ERROR' };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        description: 'Default channel for notifications',
        enableLights: true,
      });
    }

    if (!Device.isDevice) {
      logger.warn('NotificationService: Must use physical device');
      return { success: false, errorType: 'NOT_A_DEVICE' };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('NotificationService: Permission not granted');
      return { success: false, errorType: 'PERMISSION_DENIED' };
    }

    const projectId =
      Constants?.default.easConfig?.projectId ?? Constants?.default.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      logger.error('NotificationService: EAS Project ID not found');
      return { success: false, errorType: 'CONFIG_ERROR' };
    }

    try {
      // 1. Obtain Token from Expo
      const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
      const token = tokenResponse.data;

      // 2. Register with Backend
      const res = await http.post(api.notification.register, {
        token,
        user_id: userId,
      });

      if (res.success) {
        logger.info('NotificationService: Token synced successfully', { token });
        return { success: true, token };
      }

      throw new Error(res.message || 'Backend registration failed');
    } catch (error) {
      logger.error('NotificationService: Registration lifecycle failure', error);
      throw error;
    }
  },

  async unregister(_token: string): Promise<void> {
    // Implement token removal logic if needed
  },
};
