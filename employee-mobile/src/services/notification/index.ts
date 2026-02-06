import { logger } from '@/src/utils/logger';
import { registerForPushNotificationsAsync } from './registerPushToken';

export const NotificationService = {
  async getPushToken() { },
  async regPushToken({ userId }: { userId: string }): Promise<string | undefined> {
    const token = await registerForPushNotificationsAsync();
    logger.log('Push token: ', token);
    return token;
  },

  async unregPushToken(token: string): Promise<void> { },
};
