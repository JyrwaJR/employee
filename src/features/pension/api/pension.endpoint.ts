/**
 * Pension Feature Endpoints
 */
export const PENSION_ENDPOINT = {
  /** Individual employee pension history */
  LIST: (id: string) => `/employees/${id}/pension`,
  /** Specific pension slip details */
  DETAILS: (id: string, pensionId: string) => `/employees/${id}/pension/${pensionId}`,
} as const;
