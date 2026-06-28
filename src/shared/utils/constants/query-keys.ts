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

/**
 * Recommended stale times per domain, in milliseconds.
 *
 * These are presets to pass as `staleTime` in individual `useQuery` calls.
 * They override the global default (5 minutes) where data freshness needs
 * differ from the baseline.
 *
 * @example
 * ```ts
 * useQuery({
 *   queryKey: QUERY_KEYS.LEAVE.LIST(emp_cd),
 *   queryFn: ...,
 *   staleTime: STALE_TIMES.LEAVE,
 * });
 * ```
 */
export const STALE_TIMES = {
  /** Auth/session data — stale immediately, always check server. */
  AUTH: 0,
  /** Fast-changing data like leave approvals. */
  LEAVE_FAST: 1000 * 30, // 30 seconds
  /** Leave list/balance queries. */
  LEAVE: 1000 * 60 * 1, // 1 minute
  /** Moderate cadence — announcements. */
  ANNOUNCEMENT: 1000 * 60 * 5, // 5 minutes
  /** Slow-changing reference data — salary, payslips. */
  SALARY: 1000 * 60 * 15, // 15 minutes
  /** Rarely-changing — employee directory. */
  EMPLOYEE: 1000 * 60 * 30, // 30 minutes
  /** Static reference data — pension records. */
  PENSION: 1000 * 60 * 15, // 15 minutes
} as const;
