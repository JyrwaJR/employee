import { z } from 'zod';
import { DATE_DD_MM_YYYY_REGEX } from '@utils/constants/regex';
import { LEAVE_TYPES } from '../utils/constants';

export const CreateLeaveSchema = z.object({
  type: z.enum(LEAVE_TYPES, 'Leave type is required'),
  from_date: z
    .string('Start date is required')
    .min(1, 'Start date is required')
    .regex(DATE_DD_MM_YYYY_REGEX, 'Start date must be in dd-mm-yyyy format'),
  to_date: z
    .string('End date is required')
    .min(1, 'End date is required')
    .regex(DATE_DD_MM_YYYY_REGEX, 'End date must be in dd-mm-yyyy format'),
  order_number: z.string('Order number is required').min(1, 'Order number is required'),
  order_date: z
    .string('Order date is required')
    .min(1, 'Order date is required')
    .regex(DATE_DD_MM_YYYY_REGEX, 'Order date must be in dd-mm-yyyy format'),
  reason: z.string('Reason is required').min(1, 'Reason is required'),
  remarks: z.string().optional(),
});
