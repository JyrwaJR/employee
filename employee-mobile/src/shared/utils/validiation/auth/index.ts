import { z } from 'zod';
export const passwordValidation = z
  .string('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be less than 64 characters')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/\d/, 'Must contain a number')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]`~+=;/]/, 'Must contain a special character');

export const LoginSchema = z
  .object({
    phone_no: z.string('Phone number is required').length(10, 'Phone number must be 10 digits'),
    password: passwordValidation,
  })
  .strict();

export const SignUpSchema = LoginSchema.extend({
  phone_no: z.string('Phone number is required').length(10, 'Phone number must be 10 digits'),
  first_name: z
    .string('First name is required')
    .min(1, 'First name is required')
    .regex(/^[a-zA-Z]+$/, 'First name must only contain letters'),
  last_name: z
    .string('Last name is required')
    .min(1, 'Last name is required')
    .regex(/^[a-zA-Z]+$/, 'Last name must only contain letters'),
  confirm_password: passwordValidation,
})
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm_password'],
      });
    }
  })
  .strict();

export const ForgotPasswordSchema = z.object({
  phone_no: z
    .string('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
});

export const OTPSchema = z.object({
  phone_no: z.string('Phone number is required'),
  otp: z
    .string('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
});
