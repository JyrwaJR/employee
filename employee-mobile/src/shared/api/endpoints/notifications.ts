/**
 * Notification System Endpoints (Global)
 */
export const notificationEndpoints = {
  /** Register push token for User */
  register: '/notification/register',
  /** Unregister push token for User */
  unregister: '/notification/unregister',
} as const;
