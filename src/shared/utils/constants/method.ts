export const METHODS = {
  GET_EMP_DETAILS: 'get_employee_details',
} as const;

export type METHODS = keyof typeof METHODS;
