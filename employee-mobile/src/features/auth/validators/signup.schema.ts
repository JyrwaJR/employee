import { passwordValidation, phoneValidation } from '@/src/shared/validators/common';
import { z } from 'zod';

export const SignUpSchema = z
  .object({
    phone_no: phoneValidation,
    first_name: z
      .string('First name is required')
      .min(1, 'First name is required')
      .regex(/^[a-zA-Z]+$/, 'First name must only contain letters'),
    last_name: z
      .string('Last name is required')
      .min(1, 'Last name is required')
      .regex(/^[a-zA-Z]+$/, 'Last name must only contain letters'),
    password: passwordValidation,
    confirm_password: passwordValidation,
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirm_password'],
      });
    }
  })
  .strict();
