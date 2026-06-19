export const EMPLOYEE_KEYS = {
  LIST: (page?: number) => ['employees', page] as const,
  DETAILS: (id: string) => ['employee', id] as const,
};
