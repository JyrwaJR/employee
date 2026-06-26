import { RoleT } from '@sharedTypes/auth';

export type RouteConfigT = {
  url: string;
  needAuth: boolean;
  role: RoleT[];
  redirect?: string;
};

export const PUBLIC_ROUTES = ['/auth', '/auth/sign-up', '/auth/forgot-password', '/ui-lab'];

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
    url: '/pension/*',
    needAuth: true,
    role: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  },
];
