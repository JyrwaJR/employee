import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  emp_cd: z.string().min(3, 'Employee Code must be atleast 4 in length'),
});
