import { EndpointT } from '@/src/types/endpoints';

type AuthEndPoints = 'GET_ME' | 'POST_SIGN_UP' | 'POST_SIGN_IN' | 'POST_LOGOUT';

export const AUTH_ENDPOINTS: EndpointT<AuthEndPoints> = {
  GET_ME: '/auth/me',
  POST_SIGN_UP: '/auth/sign-up',
  POST_SIGN_IN: '/auth/sign-in',
  POST_LOGOUT: '/auth/logout',
};
