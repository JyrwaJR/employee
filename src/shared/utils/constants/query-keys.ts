/**
 * Shared Query Key Factory
 * Centralizes all React Query keys to prevent typos and ensure consistency.
 *
 * @example
 * // In a component or hook:
 * import { queryKeys } from '@utils/constants/query-keys';
 *
 * const { data } = useQuery({
 *   queryKey: queryKeys.employees.details(id),
 *   queryFn: () => getEmployee(id),
 * });
 */
export const queryKeys = {
  auth: {
    /** Key for the current authenticated user's data */
    me: ['me'] as const,
  },
  employees: {
    /** Key for the list of all employees */
    list: (page?: number) => ['employees', page] as const,
    /** Key for specific employee details */
    details: (id: string) => ['employee', id] as const,
  },
  leaves: {
    /** Key for a specific employee's leaves, optionally filtered by year and status */
    list: (employeeId: string, year?: string, status?: string) =>
      ['leaves', employeeId, year, status].filter(Boolean),
  },
  salary: {
    /** Key for a specific payslip by ID */
    payslip: (id: string) => ['salary', id] as const,
    /** Key for an employee's salary statements list */
    statements: (id: string, isTab?: boolean) =>
      ['employee salary', id, isTab].filter((v) => v !== undefined),
  },
  pension: {
    /** Key for pension records, typically filtered by employee ID, year, month, and status */
    list: (employeeId: string, year: string, month: string, status: string) =>
      ['pension', employeeId, year, month, status] as const,
  },
  announcements: {
    /** Key for the list of announcements, optionally paginated */
    list: (page?: number) => ['announcement_list', page].filter(Boolean),
    /** Key for a specific announcement details */
    details: (id: string) => ['announcement_details', id] as const,
  },
};
