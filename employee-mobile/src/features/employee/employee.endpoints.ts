import { path } from '@/src/shared/api/utils';

/**
 * Employee Feature Endpoints
 */
export const employeeEndpoints = {
  /** Main staff register/list */
  list: '/employees',
  /** Individual employee profile view */
  details: path('/employees/:id',),
} as const;
