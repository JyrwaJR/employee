/**
 * Registry of backend RPC method names.
 *
 * Maps human-readable keys to the string identifiers expected by the backend
 * `/make_request` endpoint.
 */
export const METHODS = {
  GET_EMP_DETAILS: 'get_employee_details',
  EMP_LOGIN: 'employee_login',
  GET_EMP_LEAVES: 'get_employee_leaves',
  GET_EMP_LEAVE_DETAILS: 'get_employee_leave_details',
  GET_LEAVE_TYPE: 'get_leave_type',
  GET_LEAVE_REASON: 'get_leave_reason',
  INSERT_UPDATE_LEAVE: 'insert_update_leave',
  GET_NOTIFICATIONS: 'get_notifications',
  GET_SALARY_STATEMENTS: 'get_salary_statement',
  // Not implemented below
  GET_EMP_SALARY_STATEMENTS_DETAILS: 'get_employee_salary_statements_DETAILS',
  INSERT_NOTIFICATION_TOKEN: 'insert_notification_token',
  GET_EMP_TAX_LIST: 'get_employee_tax_list',
  GET_EMP_TAX_DETAIL: 'get_employee_tax_detail',
  UPDATE_EMP_TAX_DETAIL: 'update_employee_tax_detail',
} as const;

/**
 * Union type of all available RPC method keys.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type METHODS = keyof typeof METHODS;
