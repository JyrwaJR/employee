// import { MetaT } from './meta';

/**
 * Standard API Response structure for all requests.
 * Used across http utility.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  // meta?: MetaT;
  error?: string | Record<string, unknown>;
  error_code?: BACKEND_ERROR_CODES;
  error_msg?: string;
}

export const BACKEND_ERROR_CODES = {
  '-1': 'FAILURE',
  '02': 'FAILURE',
  '01': 'SUCCESS',
} as const;

export type BACKEND_ERROR_CODES = keyof typeof BACKEND_ERROR_CODES;
