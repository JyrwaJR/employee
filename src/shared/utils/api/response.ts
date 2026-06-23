import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '../../types';

export class BackendError extends Error {
  error_msg: string;
  error_code: BackendCode;
  constructor(error_msg: string) {
    super(error_msg);
    this.error_msg = error_msg;
    this.error_code = '02';
  }
}

const ERROR_CODES = {
  '-1': 'FAILURE',
  '02': 'FAILURE',
  '01': 'SUCCESS',
} as const;

type BackendCode = keyof typeof ERROR_CODES;

export const isSuccessCode = (code: string): boolean => {
  return ERROR_CODES[code as BackendCode] === 'SUCCESS';
};

export class BackendSuccess extends Error {
  error_msg: string;
  error_code: 'FAILURE' | 'SUCEESS';
  constructor(error_msg: string) {
    super(error_msg);
    this.error_msg = error_msg;
    this.error_code = 'SUCEESS';
  }
}

export const handleError = <T>(error: unknown | AxiosError | Error): ApiResponse<T> => {
  let errorMessage = 'Something went wrong. Please try again.';
  let errorDetails: string | Record<string, unknown> = '';

  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage = (error.response.data as { message?: string })?.message || errorMessage;
      errorDetails =
        (error.response.data as { error?: string | Record<string, unknown> })?.error ||
        error.response.data ||
        '';
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
    message: errorMessage,
    error: errorDetails,
    data: null,
  };
};

export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const {
    data: { error_code, error_msg },
  } = response;

  if (error_code && !isSuccessCode(error_code)) {
    throw new BackendError(error_msg || 'unknown error');
  }
  return {
    success: true,
    message: error_msg || 'Successfully fetched data',
    data: response.data.data as T,
  };
};
