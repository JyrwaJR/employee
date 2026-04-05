import { authEndpoints } from '@/src/features/auth/auth.endpoints';
import { employeeEndpoints } from '@/src/features/employee/employee.endpoints';
import { leaveEndpoints } from '@/src/features/leave/leave.endpoints';
import { notificationEndpoints } from '@/src/features/pushNotification/pushNotification.endpoints';
import { pensionEndpoints } from '@/src/features/pension/pension.endpoints';
import { salaryEndpoints } from '@/src/features/salary/salary.endpoints';

/**
 * Centralized API Registry
 *
 * Provides a type-safe, hierarchical factory for all application API endpoints.
 * This ensures consistency across features and eliminates manual string manipulation.
 *
 * @example
 * // In a service or hook:
 * import { api } from '@/src/shared/api';
 * const url = api.employees.details(id);
 */
export const api = {
  auth: authEndpoints,
  employees: employeeEndpoints,
  leave: leaveEndpoints,
  notification: notificationEndpoints,
  pension: pensionEndpoints,
  salary: salaryEndpoints,
} as const;

export type ApiFactory = typeof api;
