/**
 * Leave Feature Endpoints
 */
export const LEAVE_ENDPOINT = {
  /** Individual employee leave history */
  LIST: (id: string) => `/employees/${id}/leave`,
  /** Specific leave request details */
  DETAILS: (id: string, leaveId: string) => `/employees/${id}/leave/${leaveId}`,
} as const;
