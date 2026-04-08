import { z } from 'zod';

export const employeeEndpointsSchema = z.object({
  id: z.uuid('Employee ID is required').optional(),
});
