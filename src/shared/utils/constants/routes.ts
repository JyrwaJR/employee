import { Route } from 'expo-router';

/**
 * Shared Routes Factory
 * Centralizes all application navigation paths to ensure type safety and prevent broken links.
 *
 * @example
 * // In a component or hook:
 * import { routes } from '@utils/constants/routes';
 * router.push(routes.employees.details(id));
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
     * @param phone - Optional phone number to pre-fill
     * @param step - Current step in the flow ('OTP' or 'RESET')
     */
    FORGOT_PASSWORD: (phone?: string, step?: 'OTP' | 'RESET') => {
      const params = new URLSearchParams();
      if (phone) params.append('phone', phone);
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
  LEAVE: '/leave' as const,
  STATEMENT: '/statement' as const,
  ANNOUNCEMENT: '/announcements' as const,
};
