import { AxiosRequestConfig, isCancel, AxiosResponse } from 'axios';
import { logger } from '../logger/logger';
import axiosInstance, { handleAxiosError } from '../api/axios';
import { ApiResponse } from '../../types/api';
import { z } from 'zod';

const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  return {
    success: response.data.success,
    message: response.data.message || 'Request successful',
    data: response.data.data ?? null,
    meta: response?.data?.meta,
    token: response.data.token,
  };
};

const isValidUrl = (url: string) => {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const fullUrl = BASE_URL + url;
  return z.url().safeParse(fullUrl).success;
};

export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      if (!isValidUrl(url)) {
        throw new Error('Invalid URL');
      }
      const response = await axiosInstance.get(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      if (isCancel(error)) {
        logger.warn(`GET Request to ${url} was cancelled.`);
      }
      return handleAxiosError<T>(error);
    }
  },

  post: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      if (!isValidUrl(url)) {
        throw new Error('Invalid URL');
      }
      const response = await axiosInstance.post(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  put: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      if (!isValidUrl(url)) {
        throw new Error('Invalid URL');
      }
      const response = await axiosInstance.put(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      if (!isValidUrl(url)) {
        throw new Error('Invalid URL');
      }
      const response = await axiosInstance.delete(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },
};
