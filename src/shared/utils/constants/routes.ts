import { Route } from 'expo-router';

/**
 * Shared Routes Factory
 * Centralizes all application navigation paths to ensure type safety and prevent broken links.
 *
 * @example
 * // In a component or hook:
 * import { PAGE_ROUTES } from '@utils/constants/routes';
 * router.push(PAGE_ROUTES.EMPLOYEES.DETAILS(id));
 */
export const PAGE_ROUTES = {
  /** Root route (Home) */
  HOME: '/' as const,

  /** Authentication related routes */
  AUTH: {
    LOGIN: '/auth' as Route,
    SIGN_UP: '/auth/sign-up' as Route,
    /**
     * Helper for forgot password flow with query states.
     * @param empCode - Optional phone number to pre-fill
     * @param step - Current step in the flow ('OTP' or 'RESET')
     */
    FORGOT_PASSWORD: (empCode?: string, step?: 'OTP' | 'RESET') => {
      const params = new URLSearchParams();
      if (empCode) params.append('phone', empCode);
      if (step) params.append('step', step);
      const query = params.toString();
      return `/auth/forgot-password${query ? `?${query}` : ''}` as Route;
    },
  },

  /** Admin or management routes for employees */
  EMPLOYEES: {
    /** Main staff register/list */
    LIST: '/employees' as const,
    /** Individual employee profile view */
    DETAILS: (id: string) => `/employees/${id}` as Route,
    /** Employee-specific salary history */
    SALARY_HISTORY: (id: string) => `/employees/${id}/salary` as Route,
    /** Direct link to a specific salary payslip */
    SALARY_PAY_SLIP: (id: string) => `/employees/salary/${id}` as Route,
  },

  /** Core feature sidebar/tab links */
  PENSION: '/pension' as const,
  PROFILE: '/profile' as const,
  LEAVE: {
    INDEX: '/leave' as const,
    DETAILS: (id: string) => `/leaves/${id}` as Route,
  },
  STATEMENT: '/statement' as const,
  ANNOUNCEMENT: '/announcements' as const,
};
