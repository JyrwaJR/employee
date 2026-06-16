/**
 * Notification System Endpoints (Global)
 */
export const NOTIFICATION_ENDPOINT = {
  /** Register push token for User */
  REGISTER: '/notification/register',
  /** Unregister push token for User */
  UNREGISTER: '/notification/unregister',
  /** List announcements/notices (Board) */
  LIST: '/notification/list',
} as const;
