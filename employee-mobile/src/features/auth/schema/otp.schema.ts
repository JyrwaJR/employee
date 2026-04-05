import { phoneValidation } from '@/src/shared/validation/common';
import { z } from 'zod';

export const OTPSchema = z.object({
  phone_no: phoneValidation,
  otp: z
    .string('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
});
