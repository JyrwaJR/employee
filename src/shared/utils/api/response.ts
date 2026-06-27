import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '../../types';

/**
 * Normalizes an error object into a standard `ApiResponse` failure payload.
 *
 * Distinguishes between Axios errors (server response, request failures) and
 * generic JavaScript errors, producing a user-friendly message in each case.
 *
 * @typeParam T - The expected success data type (unused in the error path).
 * @param error - The caught error of unknown origin.
 * @returns A failure `ApiResponse` with `success: false` and a descriptive message.
 */
export const handleError = <T>(error: unknown): ApiResponse<T> => {
  let errorMessage = 'Something went wrong. Please try again.';

  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage = (error.response.data as { message?: string })?.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'Please check your internet connection.';
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage || 'Failed to fetch data',
  };
};

/**
 * Normalizes a successful Axios response into a standard `ApiResponse` payload.
 *
 * Extracts `data`, `message`, and `success` from the response body, defaulting
 * to sensible fallback values when fields are missing.
 *
 * @typeParam T - The expected shape of the response data.
 * @param response - The Axios response object.
 * @returns A success `ApiResponse` with `success: true` and the extracted data.
 */
export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const { message, data, success } = response.data;

  return {
    success: success ?? true,
    message: message || 'Successfully fetched data',
    data: data,
  };
};
