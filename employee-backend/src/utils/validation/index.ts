import z from "zod";

export const phoneValidiation = z
  .string("Phone number is required")
  .min(10, "Phone number is required")
  .max(10, "Phone number must be 10 digits");

export const otpValidiation = z
  .string("OTP is required")
  .min(6, "OTP is required")
  .max(6, "OTP must be 6 digits");
