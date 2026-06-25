import { z } from 'zod';

/** Zod schema for leave balance (used/total). */
export const LeaveBalanceSchema = z
  .object({
    used: z.number(),
    total: z.number(),
  })
  .strict();

/** Inferred leave balance type. */
export type LeaveBalanceT = z.infer<typeof LeaveBalanceSchema>;

/** Zod schema for an active leave request. */
export const ActiveLeaveSchema = z
  .object({
    type: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.union([z.literal('APPROVED'), z.literal('PENDING'), z.literal('REJECTED')]),
    days: z.number(),
  })
  .strict();

/** Inferred active leave type. */
export type ActiveLeaveT = z.infer<typeof ActiveLeaveSchema>;

/** Zod schema for a single announcement. */
export const AnnouncementSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    preview: z.string(),
  })
  .strict();

/** Inferred announcement type. */
export type AnnouncementT = z.infer<typeof AnnouncementSchema>;

/** Zod schema for the full home dashboard response. */
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

/** Inferred home dashboard response type. */
export type HomeDashboardT = z.infer<typeof HomeDashboardSchema>;
