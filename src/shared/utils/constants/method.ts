/**
 * Registry of backend RPC method names.
 *
 * Maps human-readable keys to the string identifiers expected by the backend
 * `/make_request` endpoint.
 */
export const METHODS = {
  GET_ANNOUNCEMENTS: 'get_announcements',
  GET_EMP_DETAILS: 'get_employee_details',
  EMP_LOGIN: 'employee_login',
  GET_EMP_LEAVES: 'get_employee_leaves',
  GET_EMP_LEAVE_DETAILS: 'get_employee_leave_details',
  GET_LEAVE_TYPE: 'get_leave_type',
  GET_LEAVE_REASON: 'get_leave_reason',
  GET_EMP_SALARY_STATEMENTS: 'get_employee_salary_statements',
  GET_EMP_SALARY_STATEMENTS_DETAILS: 'get_employee_salary_statements_DETAILS',
  INSERT_UPDATE_LEAVE: 'insert_update_leave',
} as const;

/**
 * Union type of all available RPC method keys.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type METHODS = keyof typeof METHODS;
