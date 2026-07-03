import { z } from 'zod';
import { DATE_DD_MM_YYYY_REGEX, ONLY_NUMBER_REGEX } from '@utils/constants/regex';
import { parseDDMMYYYY } from '@utils/formatters/formatters';
import { ZodIssueCode } from 'zod/v3';

const dateField = (label: string) =>
  z
    .string()
    .min(10, `${label} is required`)
    .max(10, `${label} must be 10 characters long`)
    .regex(DATE_DD_MM_YYYY_REGEX, `${label} must be in dd-mm-yyyy format`);

export const CreateLeaveSchema = z
  .object({
    type: z.string().min(1, 'Leave type is required'),

    number_of_days: z
      .string()
      .min(1, 'Number of days is required')
      .regex(ONLY_NUMBER_REGEX, 'Invalid number'),

    from_dt: dateField('Start date'),

    to_dt: dateField('End date'),

    order_number: z.string().min(1, 'Order number is required'),

    order_dt: dateField('Order date'),

    reason: z.string().min(1, 'Reason is required'),

    remarks: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const from = parseDDMMYYYY(data.from_dt);
    const to = parseDDMMYYYY(data.to_dt);
    const order = parseDDMMYYYY(data.order_dt);

    if (!from) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['from_dt'],
        message: 'Invalid start date',
      });
    }

    if (!to) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['to_dt'],
        message: 'Invalid end date',
      });
    }

    if (!order) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['order_dt'],
        message: 'Invalid order date',
      });
    }

    if (!from || !to || !order) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (from < today) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['from_dt'],
        message: 'Start date cannot be in the past',
      });
    }

    if (to < today) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['to_dt'],
        message: 'End date cannot be in the past',
      });
    }

    if (from >= to) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['from_dt'],
        message: 'Start date must be before end date',
      });
    }
  })
  .strict();

export type CreateLeaveInputs = z.infer<typeof CreateLeaveSchema>;
