import { passwordValidation, phoneValidation } from '@/src/shared/utils/validiation/common';
import { z } from 'zod';

export const LoginSchema = z
  .object({
    phone_no: phoneValidation,
    password: passwordValidation,
  })
  .strict();
