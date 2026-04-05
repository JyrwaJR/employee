import { path } from '@/src/shared/api/utils';

/**
 * Salary Feature Endpoints
 */
export const salaryEndpoints = {
  /** Employee-specific salary history */
  list: path('/employees/:id/salary'),
  /** Direct link to a specific salary payslip */
  details: path('/salary/:id'),
} as const;
