import { z } from 'zod';
import { StatsSchema } from '../validators/stats.schema';

export type StatsT = z.infer<typeof StatsSchema>;
