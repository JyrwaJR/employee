import { AUTH_ENDPOINT } from '@features/auth/utils/constants/auth.endpoint';
import { EMPLOYEE_ENDPOINT } from '@features/employee/utils/constants/employee.endpoint';
import { NOTIFICATION_ENDPOINT } from '@features/notification/utils/constants/notification.endpoint';

export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINT,
  EMPLOYEE: EMPLOYEE_ENDPOINT,
  NOTIFICATION: NOTIFICATION_ENDPOINT,
} as const;

export type ApiFactory = typeof ENDPOINTS;
