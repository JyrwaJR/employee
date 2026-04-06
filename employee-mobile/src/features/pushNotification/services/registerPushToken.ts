import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import { logger } from '@/src/shared/utils/logger';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';

type Props = {
  userId: string;
};

/**
 * Result of the registration attempt.
 */
export type RegistrationResult = {
  success: boolean;
  token?: string;
  errorType?: 'PERMISSION_DENIED' | 'NOT_A_DEVICE' | 'CONFIG_ERROR' | 'NETWORK_ERROR';
};

/**
 * Registers the device for push notifications and syncs the token with the backend.
 * Throws errors for transient failures to enable retry logic.
 */
export async function registerForPushNotificationsAsync({
  userId,
}: Props): Promise<RegistrationResult> {
  if (!userId) {
    logger.info('PushRegister: No user id found');
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
    logger.warn('PushRegister: Must use physical device');
    return { success: false, errorType: 'NOT_A_DEVICE' };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    logger.warn('PushRegister: Permission not granted');
    return { success: false, errorType: 'PERMISSION_DENIED' };
  }

  // Identify Project ID (Required for Expo Push Service)
  const projectId =
    Constants?.default.easConfig?.projectId ?? Constants?.default.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    logger.error('PushRegister: Project ID not found in config');
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
      logger.info('PushRegister: Success', { token });
      return { success: true, token };
    }

    // Backend returned failure - throw so we can retry
    throw new Error(res.message || 'Backend registration failed');
  } catch (error) {
    logger.error('PushRegister: Technical failure during registration', error);
    // Re-throw so withRetry can handle exponential backoff
    throw error;
  }
}
