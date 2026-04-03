import { z } from 'zod';

export const phoneValidation = z
  .string()
  .min(1, 'Phone number is required')
  .length(10, 'Phone number must be exactly 10 digits')
  .regex(/^[0-9]+$/, 'Phone number must only contain digits');

export const passwordValidation = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be less than 64 characters')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/\d/, 'Must contain a number')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-\\[\]`~+=;/]/, 'Must contain a special character');
