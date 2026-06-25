export const METHODS = {
  GET_EMP_DETAILS: 'get_employee_details',
  EMP_LOGIN: 'employee_login',
  GET_OVERVIEW: 'get_overview',
} as const;

export type METHODS = keyof typeof METHODS;
