import { EndpointT } from '@/src/types/endpoints';

type AuthEndPoints =
  | 'GET_ME'
  | 'POST_SIGN_UP'
  | 'POST_SIGN_IN'
  | 'POST_LOGOUT'
  | 'POST_REFRESH'
  | 'POST_FORGOT_PASSWORD'
  | 'POST_GET_OTP'
  | 'POST_OTP_VERIFY';

export const AUTH_ENDPOINTS: EndpointT<AuthEndPoints> = {
  GET_ME: '/auth/me',
  POST_SIGN_UP: '/auth/sign-up',
  POST_SIGN_IN: '/auth/sign-in',
  POST_LOGOUT: '/auth/logout',
  POST_REFRESH: '/auth/refresh',
  POST_FORGOT_PASSWORD: '/auth/forgot-password',
  POST_GET_OTP: '/auth/init',
  POST_OTP_VERIFY: '/auth/init/verify-otp',
};
