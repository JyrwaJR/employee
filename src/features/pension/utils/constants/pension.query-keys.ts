export const PENSION_KEYS = {
  LIST: (employeeId: string, year: string, month: string, status: string) =>
    ['pension', employeeId, year, month, status] as const,
  DETAIL: (employeeId: string, pensionId: string) => ['pension', employeeId, pensionId] as const,
};
