export const QUERY_KEYS = {
  AUTH: {
    ME: ['me'] as const,
  },
  EMPLOYEES: {
    LIST: (page?: number) => ['employees', page] as const,
    DETAILS: (id: string) => ['employee', id] as const,
  },
  LEAVES: {
    LIST: (employeeId: string, year?: string, status?: string) =>
      ['leaves', employeeId, year, status].filter(Boolean),
  },
  SALARY: {
    PAYSLIP: (id: string) => ['salary', id] as const,
    STATEMENTS: (id: string, isTab?: boolean) =>
      ['employee salary', id, isTab].filter((v) => v !== undefined),
  },
  PENSION: {
    LIST: (employeeId: string, year: string, month: string, status: string) =>
      ['pension', employeeId, year, month, status] as const,
    DETAIL: (employeeId: string, pensionId: string) => ['pension', employeeId, pensionId] as const,
  },
  ANNOUNCEMENTS: {
    LIST: (page?: number) => ['announcement_list', page].filter(Boolean),
    DETAILS: (id: string) => ['announcement_details', id] as const,
  },
};
