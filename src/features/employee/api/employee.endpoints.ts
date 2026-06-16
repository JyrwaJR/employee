/**
 * Employee Feature Endpoints
 */
export const employeeEndpoints = {
  /** Main staff register/list */
  list: '/employees',
  /** Individual employee profile view */
  details: '/employees/:id',
} as const;
