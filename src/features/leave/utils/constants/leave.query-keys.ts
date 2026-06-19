export const LEAVE_KEYS = {
  LIST: (employeeId: string, year?: string, status?: string) =>
    ['leaves', employeeId, year, status].filter(Boolean),
};
