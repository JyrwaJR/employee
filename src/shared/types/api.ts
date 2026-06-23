import { MetaT } from './meta';

/**
 * Standard API Response structure for all requests.
 * Used across http utility.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: MetaT;
  error?: string | Record<string, unknown>;
  error_code?: string;
  error_msg?: string;
}
