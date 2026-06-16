/**
 * Employee Feature Endpoints
 */
export const EMPLOYEE_ENDPOINT = {
  /** Main staff register/list */
  LIST: '/employees',
  /** Individual employee profile view */
  DETAILS: (id: string) => `/employees/${id}`,
} as const;
