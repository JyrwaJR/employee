import { z } from 'zod';
import {
  leaveCodeValidation,
  leaveNoOfdaysValidation,
  leaveOrderNoValidation,
  leaveReasonCodeValidation,
  leaveReasonTextValidation,
  refineLeaveDates,
  leaveRemarksValidation,
} from './common';
import { dateValidation } from '@validators/common';

// ─── Schemas ─────────────────────────────────────────────────

export const CreateLeaveSchema = z
  .object({
    leave_cd: leaveCodeValidation,
    from_dt: dateValidation('Start date'),
    to_dt: dateValidation('End date'),
    no_days: leaveNoOfdaysValidation,
    order_dt: dateValidation('Order date'),
    order_no: leaveOrderNoValidation,
    remarks: leaveRemarksValidation,
    reason_text: leaveReasonTextValidation,
    reason_cd: leaveReasonCodeValidation,
  })
  .superRefine((data, ctx) => refineLeaveDates({ ...data, order_dt: data.order_dt }, ctx));

export type CreateLeaveInputs = z.infer<typeof CreateLeaveSchema>;
