import {
  LOWERCASE_LETTER_REGEX,
  NUMBER_REGEX,
  ONLY_NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
  UPPERCASE_LETTER_REGEX,
} from '@shared/constants/regex';
import { z } from 'zod';

export const phoneValidation = z
  .string('Phone number is required')
  .min(10, 'Phone number is required')
  .length(10, 'Phone number must be exactly 10 digits')
  .regex(ONLY_NUMBER_REGEX, 'Phone number must only contain digits');

export const passwordValidation = z
  .string('Password is required')
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be less than 64 characters')
  .regex(LOWERCASE_LETTER_REGEX, 'Must contain a lowercase letter')
  .regex(UPPERCASE_LETTER_REGEX, 'Must contain an uppercase letter')
  .regex(NUMBER_REGEX, 'Must contain a number')
  .regex(SPECIAL_CHARACTER_REGEX, 'Must contain a special character');

export const methodValidation = (name: string) =>
  z.string('Method is required').default(name).optional().nullable().catch(name);
