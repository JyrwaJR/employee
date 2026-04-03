import { phoneValidation } from '@/src/shared/utils/validiation/common';
import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  phone_no: phoneValidation,
});
