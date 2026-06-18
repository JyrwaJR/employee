import { z } from 'zod';
import { passwordValidation } from '@/src/shared/validators/common';
import { ONLY_NUMBER_REGEX } from '@utils/constants/regex';

/**
 * Schema for Reset Password Step 1: New Password & Confirm Password
 */
export const ResetPasswordSchema = z
  .object({
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
  });

/**
 * Schema for Reset Password Step 2: OTP Verification
 */
export const ResetPasswordOtpSchema = z.object({
  otp: z
    .string('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(ONLY_NUMBER_REGEX, 'OTP must only contain numbers'),
});

/**
 * Inferred types for the reset password forms
 */
export type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>;
export type ResetPasswordOtpInputs = z.infer<typeof ResetPasswordOtpSchema>;
