import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '../../types';

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

export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const { message, data, success } = response.data;

  return {
    success: success ?? true,
    message: message || 'Successfully fetched data',
    data: data,
  };
};
