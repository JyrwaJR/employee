import { z } from 'zod';

export const LoginSchema = z
  .object({
    emp_cd: z
      .string('Employee code is required')
      .min(1, 'Employee code is required')
      .transform((val) => val.toUpperCase()),
    password: z.string('Password is required').min(1, 'Password is required'),
  })
  .strict();
