import { path } from '@/src/shared/api/utils';

/**
 * Pension Feature Endpoints
 */
export const pensionEndpoints = {
  /** Individual employee pension history */
  list: path('/employees/:id/pension'),
  /** Specific pension slip details */
  details: path('/employees/:id/pension/:pensionId'),
} as const;
