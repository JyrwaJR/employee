import { Route } from 'expo-router';

/**
 * Shared Routes Factory
 * Centralizes all application navigation paths to ensure type safety and prevent broken links.
 *
 * @example
 * // In a component or hook:
 * import { routes } from '@/src/shared/constants/routes';
 * router.push(routes.employees.details(id));
 */
export const routes = {
  /** Root route (Home) */
  home: '/' as const,

  /** Authentication related routes */
  auth: {
    login: '/auth' as Route,
    signUp: '/auth/sign-up' as Route,
    /**
     * Helper for forgot password flow with query states.
     * @param phone - Optional phone number to pre-fill
     * @param step - Current step in the flow ('OTP' or 'RESET')
     */
    forgotPassword: (phone?: string, step?: 'OTP' | 'RESET') => {
      const params = new URLSearchParams();
      if (phone) params.append('phone', phone);
      if (step) params.append('step', step);
      const query = params.toString();
      return `/auth/forgot-password${query ? `?${query}` : ''}` as Route;
    },
  },

  /** Admin or management routes for employees */
  employees: {
    /** Main staff register/list */
    list: '/employees' as const,
    /** Individual employee profile view */
    details: (id: string) => `/employees/${id}` as Route,
    /** Employee-specific salary history */
    salaryHistory: (id: string) => `/employees/${id}/salary` as Route,
    /** Direct link to a specific salary payslip */
    salaryPayslip: (id: string) => `/employees/salary/${id}` as Route,
  },

  /** Core feature sidebar/tab links */
  pension: '/pension' as const,
  profile: '/profile' as const,
  leave: '/leave' as const,
  statement: '/statement' as const,
  announcements: '/announcements' as const,
};
