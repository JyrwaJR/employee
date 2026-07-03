import { z } from 'zod';
import { DATE_YYYY_MM_DD_REGEX, ONLY_NUMBER_REGEX } from '@utils/constants/regex';
import { parseYYYYMMDD } from '@utils/formatters/formatters';
import { ZodIssueCode } from 'zod/v3';
import { calculateDaysBetweenDatesWithoutWeekends } from '@utils/helpers';

const dateValidation = (label: string) =>
  z
    .string()
    .min(10, `${label} is required`)
    .max(10, `${label} must be 10 characters long`)
    .regex(DATE_YYYY_MM_DD_REGEX, `${label} must be in dd-mm-yyyy format`);

export const CreateLeaveSchema = z
  .object({
    leave_cd: z.string().min(1, 'Leave type is required'),

    from_dt: dateValidation('Start date'),

    to_dt: dateValidation('End date'),

    no_days: z
      .string()
      .min(1, 'Number of days is required')
      .regex(ONLY_NUMBER_REGEX, 'Invalid number'),

    order_dt: dateValidation('Order date'),

    order_no: z.string().min(1, 'Order number is required'),

    remarks: z.string().nullable().optional(),

    reason_text: z.string().min(1, 'Reason is required'),
    reason_cd: z.string().min(1, 'Reason is required'),
  })
  .superRefine((data, ctx) => {
    const from = parseYYYYMMDD(data.from_dt);
    const to = parseYYYYMMDD(data.to_dt);
    const order = parseYYYYMMDD(data.order_dt);
    const noDays = calculateDaysBetweenDatesWithoutWeekends(data.from_dt, data.to_dt);

    if (noDays !== data.no_days) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['no_days'],
        message: `Number of days must be ${noDays}`,
      });
    }

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
  });

export type CreateLeaveInputs = z.infer<typeof CreateLeaveSchema>;

export const UpdateLeaveSchema = z

  .object({
    leave_cd: z.string().min(1, 'Leave type is required'),

    from_dt: dateValidation('Start date'),

    to_dt: dateValidation('End date'),

    no_days: z
      .string()
      .min(1, 'Number of days is required')
      .regex(ONLY_NUMBER_REGEX, 'Invalid number'),

    remarks: z.string().nullable().optional(),

    reason_text: z.string().min(1, 'Reason is required'),
    reason_cd: z.string().min(1, 'Reason is required'),
  })
  .superRefine((data, ctx) => {
    const from = parseYYYYMMDD(data.from_dt);
    const to = parseYYYYMMDD(data.to_dt);
    const noDays = calculateDaysBetweenDatesWithoutWeekends(data.from_dt, data.to_dt);

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

    if (!from || !to) return;

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

    if (noDays !== data.no_days) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ['no_days'],
        message: `Number of days must be ${noDays}`,
      });
    }
  });

export type UpdateLeaveInput = z.infer<typeof UpdateLeaveSchema>;
