export const TAX_ENDPOINT = {
  LIST: '/tax',
  DETAIL: (employeeId: string) => '/tax/' + employeeId,
  UPDATE: (employeeId: string) => '/tax/' + employeeId,
} as const;
