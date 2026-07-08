import { z } from 'zod';

export const updateTaxSchema = z.object({
  regime: z.enum(['NEW', 'OLD'], { message: 'Please select a tax regime' }),
  deductions80C: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .max(150000, 'Max Rs 1,50,000 under Section 80C'),
  deductions80D: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .max(100000, 'Max Rs 1,00,000 under Section 80D'),
  hraExemption: z.coerce.number().min(0, 'Cannot be negative'),
  ltaExemption: z.coerce.number().min(0, 'Cannot be negative'),
  homeLoanInterest: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .max(200000, 'Max Rs 2,00,000 under Section 24(b)'),
  npsContribution: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .max(50000, 'Max Rs 50,000 under Section 80CCD(1B)'),
});

export type UpdateTaxFormValues = z.infer<typeof updateTaxSchema>;
