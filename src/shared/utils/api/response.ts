import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, BACKEND_ERROR_CODES } from '../../types';

export class BackendError extends Error {
  error_msg: string;
  error_code: BACKEND_ERROR_CODES;
  constructor(error_msg: string, error_code: BACKEND_ERROR_CODES) {
    super(error_msg);
    this.error_msg = error_msg;
    this.error_code = error_code;
  }
}

export const isSuccessCode = (code: string): boolean => {
  return BACKEND_ERROR_CODES[code as BACKEND_ERROR_CODES] === 'SUCCESS';
};

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
  } else if (error instanceof BackendError) {
    errorMessage = error.error_msg;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage || 'Failed to fetch data',
    data: null,
  };
};

export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const {
    data: { error_code, error_msg, message },
  } = response;

  if (typeof error_code === 'string' && !!error_code) {
    throw new BackendError(error_msg || 'unknown error', error_code);
  }

  return {
    success: true,
    message: message || 'Successfully fetched data',
    data: response.data.data ?? null,
  };
};
