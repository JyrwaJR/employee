import { z } from 'zod';
import {
  DATE_YYYY_MM_DD_REGEX,
  ONLY_LETTER_REGEX,
  ONLY_NUMBER_REGEX,
} from '@utils/constants/regex';
import { parseYYYYMMDD } from '@utils/formatters/formatters';
import { ZodIssueCode } from 'zod/v3';
import { calculateDaysBetweenDatesWithoutWeekends } from '@utils/helpers';

// ─── Field Validators ────────────────────────────────────────

const leaveCodeValidation = z
  .string('Leave Code is required')
  .min(1, 'Leave type is required')
  .regex(ONLY_LETTER_REGEX, 'Leave Code should only be letters');

const dateValidation = (label: string) =>
  z
    .string('Date is required')
    .min(10, `${label} is required`)
    .max(10, `${label} must be 10 characters long`)
    .regex(DATE_YYYY_MM_DD_REGEX, `${label} must be in dd-mm-yyyy format`);

const noDaysValidation = z
  .string('Number of days is required')
  .min(1, 'Number of days is required')
  .regex(ONLY_NUMBER_REGEX, 'Invalid number');

const orderNoValidation = z
  .string('Order number is required')
  .regex(ONLY_NUMBER_REGEX, 'Order number should be number only')
  .min(1, 'Order number is required');

const remarksValidation = z.string('Leave remarks').nullable().optional();

const reasonTextValidation = z
  .string('Reason is required')
  .min(3, 'Reason is required')
  .regex(ONLY_LETTER_REGEX, 'Reason should be letters');

const reasonCodeValidation = z
  .string('Reason code is required')
  .min(1, 'Reason is required')
  .regex(ONLY_LETTER_REGEX, 'Reason code should only be letters');

// ─── Cross-field validation logic ────────────────────────────

const refineDates = (
  data: {
    from_dt: string;
    to_dt: string;
    order_dt?: string;
    no_days?: string;
  },
  ctx: z.RefinementCtx
) => {
  const from = parseYYYYMMDD(data.from_dt);
  const to = parseYYYYMMDD(data.to_dt);
  const order = data.order_dt ? parseYYYYMMDD(data.order_dt) : null;
  const noDays = calculateDaysBetweenDatesWithoutWeekends(data.from_dt, data.to_dt);

  if (data.no_days && noDays !== data.no_days) {
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

  if (order === null && data.order_dt) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ['order_dt'],
      message: 'Invalid order date',
    });
  }

  if (!from || !to) return;
  if (data.order_dt && !order) return;

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
};

// ─── Schemas ─────────────────────────────────────────────────

export const CreateLeaveSchema = z
  .object({
    leave_cd: leaveCodeValidation,
    from_dt: dateValidation('Start date'),
    to_dt: dateValidation('End date'),
    no_days: noDaysValidation,
    order_dt: dateValidation('Order date'),
    order_no: orderNoValidation,
    remarks: remarksValidation,
    reason_text: reasonTextValidation,
    reason_cd: reasonCodeValidation,
  })
  .superRefine((data, ctx) => refineDates({ ...data, order_dt: data.order_dt }, ctx));

export type CreateLeaveInputs = z.infer<typeof CreateLeaveSchema>;

export const UpdateLeaveSchema = z
  .object({
    leave_cd: leaveCodeValidation,
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
  .superRefine((data, ctx) => refineDates(data, ctx));

export type UpdateLeaveInput = z.infer<typeof UpdateLeaveSchema>;
