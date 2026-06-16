/**
 * Salary Feature Endpoints
 */
export const SALARY_ENDPOINT = {
  /** Employee-specific salary history */
  LIST: (id: string) => `/employees/${id}/salary`,
  /** Direct link to a specific salary payslip */
  DETAILS: (id: string) => `/salary/${id}`,
} as const;
