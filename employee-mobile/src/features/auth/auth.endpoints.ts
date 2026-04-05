/**
 * Auth Feature Endpoints
 */
export const authEndpoints = {
  me: '/auth/me',
  signUp: '/auth/sign-up',
  login: '/auth/sign-in',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  getOtp: '/auth/init',
  verifyOtp: '/auth/init/verify-otp',
} as const;
