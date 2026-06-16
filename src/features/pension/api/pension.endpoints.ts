/**
 * Pension Feature Endpoints
 */
export const pensionEndpoints = {
  /** Individual employee pension history */
  list: '/employees/:id/pension',
  /** Specific pension slip details */
  details: '/employees/:id/pension/:pensionId',
} as const;
