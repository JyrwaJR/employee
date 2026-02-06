import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Constants from 'expo-constants';
import { logger } from '@/src/utils/logger';
import { http } from '@/src/utils/http';
import { NOTIFICATION_ENDPOINTS } from '@/src/libs/endpoints/notification';

export async function registerForPushNotificationsAsync() {
  try {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'A channel is needed for the permissions prompt to appear',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        logger.log('Permission not granted to get push token for push notification!');
        return;
      }

      try {
        const projectId =
          Constants?.default.easConfig?.projectId ??
          Constants?.default.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
          throw new Error('Project ID not found');
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } catch (e) {
        logger.error('Error getting a push token', e);
        // Don't throw, just return undefined so the app doesn't crash on token failure
        return undefined;
      }
    } else {
      logger.error('Must use physical device for Push Notifications');
    }
    if (token) {
      const res = await http.post(NOTIFICATION_ENDPOINTS.POST_REG_PUSH_TOKEN, { token });
      if (res.success) {
        logger.info('Push token Registered', res.data);
      }
    }
    return token;
  } catch (error) {
    logger.error('Error in registerForPushNotificationsAsync', error);
    return undefined;
  }
}
