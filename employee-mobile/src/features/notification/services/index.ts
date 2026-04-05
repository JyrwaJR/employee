import { registerForPushNotificationsAsync } from './registerPushToken';

export const NotificationService = {
  async getPushToken() {},
  async regPushToken({ userId }: { userId: string }): Promise<string | undefined> {
    const token = await registerForPushNotificationsAsync({ userId });
    return token;
  },

  async unregPushToken(_token: string): Promise<void> {},
};
