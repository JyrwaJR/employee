import { phoneValidation } from '@validators/common';
import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  phone_no: phoneValidation,
});
