import { AUTH_ENDPOINT } from '@features/auth/utils/constants/auth.endpoint';
import { NOTIFICATION_ENDPOINT } from '@features/notification/utils/constants/notification.endpoint';
import { SALARY_ENDPOINT } from '@features/salary/utils/constants/salary.endpoint';

/**
 * Centralized API Registry
 *
 * Provides a type-safe, hierarchical factory for all application API endpoints.
 * This ensures consistency across features and eliminates manual string manipulation.
 *
 * @example
 * // In a service or ook:
 * import { ENDPOINTS } from '@utils/constants/endpoints';
 * const url = ENDPOINTS.EMPLOYEE.DETAILS(id);
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINT,
  NOTIFICATION: NOTIFICATION_ENDPOINT,
  SALARY: SALARY_ENDPOINT,
} as const;

export type ApiFactory = typeof ENDPOINTS;
