import { $Enums } from "@src/libs/db/prisma/generated/prisma";
import { z } from "zod";

import { otpValidiation, passwordValidation, phoneValidiation } from "..";

export const LoginSchema = z
  .object({
    phone_no: phoneValidiation,
    password: passwordValidation,
  })
  .strict();

export const SignUpSchema = LoginSchema.extend({
  phone_number: phoneValidiation,
  email: z.email("Email is required"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "First name must only contain letters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z]+$/, "Last name must only contain letters"),
  password: passwordValidation,
  confirm_password: passwordValidation,
  role: z
    .enum([$Enums.Role.USER, $Enums.Role.ADMIN, $Enums.Role.SUPER_ADMIN])
    .optional(),
})
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirm_password", "password"],
      });
    }
  })
  .strict();

export const ForgotPasswordSchema = z
  .object({
    otp: otpValidiation,
    phone_no: phoneValidiation,
    password: passwordValidation,
    confirm_password: passwordValidation,
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirm_password", "password"],
      });
    }
  })
  .strict();
