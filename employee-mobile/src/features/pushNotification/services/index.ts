import { registerForPushNotificationsAsync } from './registerPushToken';

export const PushNotificationService = {
  async getPushToken() {},
  async regPushToken({ userId }: { userId: string }): Promise<string | undefined> {
    const token = await registerForPushNotificationsAsync({ userId });
    // TODO: Lint error here need fixing
    // @ts-expect-error
    return token;
  },

  async unregPushToken(_token: string): Promise<void> {},
};
