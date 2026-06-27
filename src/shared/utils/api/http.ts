import { AxiosRequestConfig, isCancel } from 'axios';
import { logger } from '../logger/logger';
import axiosInstance from '@utils/api/axios';
import { ApiResponse } from '@sharedTypes/api';
import { handleResponse, handleError } from './response';
import { isExpo } from '@utils/helpers/expo';

const isAxios = process.env.EXPO_PUBLIC_HTTP_PROVIDER === 'axios';

const axiosHttp = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      if (isCancel(error)) {
        logger.warn(`GET ${url} Request to ${url} was cancelled.`);
      }
      return handleError<T>(error);
    }
  },

  post: async <T>(
    url: string,
    data?: object | FormData | string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleError<T>(error);
    }
  },

  put: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleError<T>(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleError<T>(error);
    }
  },
};

let http = axiosHttp;

if (!isAxios && !isExpo()) {
  http = require('./rn-fetch-blob-client').rnFetchBlobClient;
}

export { http };
