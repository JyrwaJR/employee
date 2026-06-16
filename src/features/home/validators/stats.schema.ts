import { z } from 'zod';

export const StatsSchema = z.object({
  label: z.string(),
  value: z.string(),
  color: z.string(),
});
