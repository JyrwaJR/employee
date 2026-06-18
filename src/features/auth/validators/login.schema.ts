import { methodValidation } from '@validators/common';
import { z } from 'zod';

export const LoginSchema = z
  .object({
    functionName: methodValidation('employee_login'),
    emp_cd: z
      .string('Employee code is required')
      .min(1, 'Employee code is required')
      .transform((val) => val.toUpperCase()),
    password: z.string('Password is required').min(1, 'Password is required'),
  })
  .strict();
