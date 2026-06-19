export const SALARY_KEYS = {
  PAYSLIP: (id: string) => ['salary', id] as const,
  STATEMENTS: (id: string, isTab?: boolean) =>
    ['employee salary', id, isTab].filter((v) => v !== undefined),
};
