export const METHODS = {
  GET_EMP_DETAILS: 'get_employee_details',
  EMP_LOGIN: 'employee_login',
  GET_EMP_LEAVE_DETAILS: 'get_employee_leave_details',
  GET_EMP_LEAVE_DETAILS_DETAILS: 'get_employee_leave_details_details',
  GET_EMP_SALARY_STATEMENTS: 'get_employee_salary_statements',
  GET_EMP_SALARY_STATEMENTS_DETAILS: 'get_employee_salary_statements_DETAILS',
} as const;

export type METHODS = keyof typeof METHODS;
