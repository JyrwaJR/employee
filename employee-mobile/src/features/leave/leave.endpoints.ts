import { path } from '@/src/shared/api/utils';

/**
 * Leave Feature Endpoints
 */
export const leaveEndpoints = {
  /** Individual employee leave history */
  list: path('/employees/:id/leave'),
  /** Specific leave request details */
  details: path('/employees/:id/leave/:leaveId'),
} as const;
