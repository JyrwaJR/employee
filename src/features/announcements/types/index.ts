import { z } from 'zod';
import {
  AnnouncementCategorySchema,
  AnnouncementPrioritySchema,
  AnnouncementSchema,
} from '../validators';

export type AnnouncementCategoryT = z.infer<typeof AnnouncementCategorySchema>;
export type AnnouncementPriorityT = z.infer<typeof AnnouncementPrioritySchema>;
export type AnnouncementT = z.infer<typeof AnnouncementSchema>;

export interface AnnouncementResponseT {
  items: AnnouncementT[];
  meta: {
    total: number;
    page: number;
    hasMore: boolean;
  };
}
