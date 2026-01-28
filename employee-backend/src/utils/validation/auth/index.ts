import { $Enums } from "@src/libs/db/prisma/generated/prisma";
import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be less than 64 characters")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-\\[\]`~+=;/]/,
    "Must contain a special character",
  );

export const LoginSchema = z
  .object({
    email: z.email("Invalid email").min(1, "Email is required"),
    password: passwordValidation,
  })
  .strict();

export const SignUpSchema = LoginSchema.extend({
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "First name must only contain letters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z]+$/, "Last name must only contain letters"),
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
