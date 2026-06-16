/**
 * Salary Feature Endpoints
 */
export const salaryEndpoints = {
  /** Employee-specific salary history */
  list: '/employees/:id/salary',
  /** Direct link to a specific salary payslip */
  details: '/salary/:id',
} as const;
