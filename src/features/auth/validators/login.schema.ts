import { passwordValidation, phoneValidation } from '@/src/shared/validators/common';
import { z } from 'zod';

export const LoginSchema = z
  .object({
    phone_no: phoneValidation,
    password: passwordValidation,
  })
  .strict();
