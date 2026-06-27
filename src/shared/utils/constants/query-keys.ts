/**
 * Centralized React Query key factory.
 *
 * Provides consistent, type-safe query keys for cache management across features.
 * Each top-level key corresponds to a domain, with nested factories for specific
 * queries (list, details, overview, etc.).
 */
export const QUERY_KEYS = {
  AUTH: {
    ME: ['me'] as const,
  },
  HOME: {
    OVERVIEW: (...args: string[]) => ['home', 'overview', ...args] as const,
  },
  SALARY: {
    PAYSLIP: (...args: string[]) => ['salary', ...args] as const,
    STATEMENTS: (...args: string[]) => ['employee salary', ...args].filter(Boolean),
  },
  PENSION: {
    LIST: (employeeId: string, year: string, month: string, status: string) =>
      ['pension', employeeId, year, month, status] as const,
    DETAIL: (employeeId: string, pensionId: string) => ['pension', employeeId, pensionId] as const,
  },
  LEAVE: {
    LIST: (...args: string[]) => ['leaves', ...args].filter(Boolean),
    DETAILS: (...args: string[]) => ['leaves', ...args].filter(Boolean),
  },
  EMPLOYEE: {
    LIST: (page?: number) => ['employees', page] as const,
    DETAILS: (id: string) => ['employee', id] as const,
  },
  ANNOUNCEMENT: {
    LIST: (page?: number) => ['announcement_list', page].filter(Boolean),
    DETAILS: (id: string) => ['announcement_details', id] as const,
  },
};
