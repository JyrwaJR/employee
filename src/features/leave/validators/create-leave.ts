import { z } from 'zod';

export const CreateLeaveSchema = z.object({
  type: z.string('Leave type is required').min(1, 'Leave type is required'),
  from_date: z.string('Start date is required').min(1, 'Start date is required'),
  to_date: z.string('End date is required').min(1, 'End date is required'),
  order_number: z.string('Order number is required').min(1, 'Order number is required'),
  order_date: z.string('Order date is required').min(1, 'Order date is required'),
  reason: z.string('Reason is required').min(1, 'Reason is required'),
  remarks: z.string().optional(),
});
