import { RoleT } from '@sharedTypes/auth';

/**
 * Configuration for a role-protected route.
 */
export type RouteConfigT = {
  /** The route path pattern (supports wildcards like `/(admin)/*`). */
  url: string;
  /** Whether the route requires authentication. */
  needAuth: boolean;
  /** Allowed user roles for this route. */
  role: RoleT[];
  /** Optional redirect path when access is denied. */
  redirect?: string;
};

/**
 * Routes accessible without authentication.
 */
export const PUBLIC_ROUTES = ['/auth', '/auth/sign-up', '/auth/forgot-password', '/ui-lab'];

/**
 * Role-based route protection rules.
 * Each entry defines a route pattern and the set of roles allowed to access it.
 */
export const ROUTE_ROLES: RouteConfigT[] = [
  {
    url: '/(admin)/*',
    needAuth: true,
    role: ['SUPER_ADMIN', 'ADMIN'],
    redirect: '/forbidden',
  },
  {
    url: '/settings/*',
    needAuth: true,
    role: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  },
  {
    url: '/leaves/*',
    needAuth: true,
    role: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  },
];
