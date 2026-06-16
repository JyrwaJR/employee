/**
 * Auth Feature Endpoints
 */
export const AUTH_ENDPOINT = {
  ME: '/auth/me',
  SIGN_UP: '/auth/sign-up',
  LOGIN: '/auth/sign-in',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  GET_OTP: '/auth/init',
  VERIFY_OTP: '/auth/init/verify-otp',
} as const;
