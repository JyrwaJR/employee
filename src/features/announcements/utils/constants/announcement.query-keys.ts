export const ANNOUNCEMENT_KEYS = {
  LIST: (page?: number) => ['announcement_list', page].filter(Boolean),
  DETAILS: (id: string) => ['announcement_details', id] as const,
};
