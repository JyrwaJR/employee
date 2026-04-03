import { logger } from '@/src/shared/utils/logger';
import { registerForPushNotificationsAsync } from './registerPushToken';

export const NotificationService = {
  async getPushToken() {},
  async regPushToken({ userId }: { userId: string }): Promise<string | undefined> {
    const token = await registerForPushNotificationsAsync({ userId });
    return token;
  },

  async unregPushToken(token: string): Promise<void> {},
};
