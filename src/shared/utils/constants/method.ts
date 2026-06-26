export const METHODS = {
  GET_EMP_DETAILS: 'get_employee_details',
  EMP_LOGIN: 'employee_login',
  GET_EMP_LEAVE_DETAILS: 'get_employee_leave_details',
} as const;

export type METHODS = keyof typeof METHODS;
