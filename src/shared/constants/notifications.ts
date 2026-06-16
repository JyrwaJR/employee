/**
 * Application-wide Notification & Toast Registry
 * Flat structure supporting multiple messages per feature domain.
 *
 * Usage: notify(data, 'AUTH_LOGIN')
 */
export const NOTIFY = {
  // --- AUTH DOMAIN ---
  AUTH_LOGIN: {
    success_title: 'Authentication Success',
    error_title: 'Authentication Failed',
    success_msg: 'Sign in successful',
    error_msg: 'Invalid credentials',
  },
  AUTH_REGISTER: {
    success_title: 'Registration Success',
    error_title: 'Registration Failed',
    success_msg: 'Sign up successful',
    error_msg: 'Could not complete registration',
  },
  AUTH_OTP: {
    success_title: 'Secure Code Sent',
    error_title: 'OTP Error',
    success_msg: 'Verification code sent to your phone',
    error_msg: 'Failed to send verification code',
  },
  AUTH_VERIFY: {
    success_title: 'Verification Success',
    error_title: 'Verification Failed',
    success_msg: 'Code verified successfully',
    error_msg: 'Invalid verification code',
  },
  AUTH_RESET: {
    success_title: 'Security Update',
    error_title: 'Update Failed',
    success_msg: 'Password reset successful',
    error_msg: 'Unable to reset password',
  },
  AUTH_LOGOUT: {
    success_title: 'Session Ended',
    error_title: 'Logout Error',
    success_msg: 'You have been signed out',
    error_msg: 'Could not complete logout',
  },

  // --- EMPLOYEE DOMAIN ---
  EMPLOYEE_UPDATE: {
    success_title: 'Staff Registry',
    error_title: 'Update Failed',
    success_msg: 'Employee details updated successfully',
    error_msg: 'Could not update employee details',
  },

  // --- SALARY DOMAIN ---
  SALARY_FETCH: {
    success_title: 'Payroll System',
    error_title: 'Access Error',
    success_msg: 'Statement fetched successfully',
    error_msg: 'Could not retrieve payroll details',
  },

  // --- COMMON / SYSTEM ---
  SYSTEM_ERROR: {
    success_title: 'Success',
    error_title: 'System Error',
    success_msg: 'Action completed successfully',
    error_msg: 'Something went wrong. Please try again.',
  },
  CONNECTION_ERROR: {
    success_title: 'Connection Success',
    error_title: 'Connection Failed',
    success_msg: 'Connected successfully',
    error_msg: 'Please check your internet connection.',
  },
  PUSH_SYSTEM: {
    success_title: 'New Notification',
    error_title: 'Notice',
    success_msg: 'A new update is available',
    error_msg: 'An alert was received',
  },
} as const;

export type NotificationKey = keyof typeof NOTIFY;
