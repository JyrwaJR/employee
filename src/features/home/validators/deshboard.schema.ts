import { z } from 'zod';

export const LeaveBalanceSchema = z
  .object({
    used: z.number(),
    total: z.number(),
  })
  .strict();

export type LeaveBalanceT = z.infer<typeof LeaveBalanceSchema>;

export const ActiveLeaveSchema = z
  .object({
    type: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.union([z.literal('APPROVED'), z.literal('PENDING')]),
    days: z.number(),
  })
  .strict();

export type ActiveLeaveT = z.infer<typeof ActiveLeaveSchema>;

export const AnnouncementSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    preview: z.string(),
  })
  .strict();

export type AnnouncementT = z.infer<typeof AnnouncementSchema>;

export const HomeDashboardSchema = z
  .object({
    leaveBalance: z.object({
      annual: LeaveBalanceSchema,
      sick: LeaveBalanceSchema,
    }),
    attendance: z.object({
      present: z.number(),
      workingDays: z.number(),
    }),
    activeLeave: ActiveLeaveSchema.nullable(),
    announcements: z.array(AnnouncementSchema),
  })
  .strict();

export type HomeDashboardT = z.infer<typeof HomeDashboardSchema>;
