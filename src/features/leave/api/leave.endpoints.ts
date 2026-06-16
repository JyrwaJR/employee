/**
 * Leave Feature Endpoints
 */
export const leaveEndpoints = {
  /** Individual employee leave history */
  list: '/employees/:id/leave',
  /** Specific leave request details */
  details: '/employees/:id/leave/:leaveId',
} as const;
