import { path } from '@/src/shared/api/utils';
import { employeeEndpointsSchema } from '../validators/endpoints.schema';

/**
 * Employee Feature Endpoints
 */
export const employeeEndpoints = {
  /** Main staff register/list */
  list: '/employees',
  /** Individual employee profile view */
  details: path('/employees/:id', {
    params: employeeEndpointsSchema,
  }),
} as const;
