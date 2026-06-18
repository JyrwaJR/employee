import { ONLY_NUMBER_REGEX } from '@utils/constants/regex';
import { phoneValidation } from '@validators/common';
import { z } from 'zod';

export const OTPSchema = z.object({
  phone_no: phoneValidation,
  otp: z
    .string('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(ONLY_NUMBER_REGEX, 'OTP must only contain numbers'),
});
