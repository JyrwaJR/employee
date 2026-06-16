import { AUTH_ENDPOINT } from '@/src/features/auth/api/auth.endpoint';
import { EMPLOYEE_ENDPOINT } from '@/src/features/employee/api/employee.endpoint';
import { LEAVE_ENDPOINT } from '@/src/features/leave/api/leave.endpoint';
import { NOTIFICATION_ENDPOINT } from '@/src/features/notification/api/notification.endpoint';
import { PENSION_ENDPOINT } from '@/src/features/pension/api/pension.endpoint';
import { SALARY_ENDPOINT } from '@/src/features/salary/api/salary.endpoint';

/**
 * Centralized API Registry
 *
 * Provides a type-safe, hierarchical factory for all application API endpoints.
 * This ensures consistency across features and eliminates manual string manipulation.
 *
 * @example
 * // In a service or hook:
 * import { ENDPOINTS } from '@/src/shared/api';
 * const url = ENDPOINTS.EMPLOYEE.DETAILS(id);
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINT,
  EMPLOYEE: EMPLOYEE_ENDPOINT,
  LEAVE: LEAVE_ENDPOINT,
  NOTIFICATION: NOTIFICATION_ENDPOINT,
  PENSION: PENSION_ENDPOINT,
  SALARY: SALARY_ENDPOINT,
} as const;

export type ApiFactory = typeof ENDPOINTS;
