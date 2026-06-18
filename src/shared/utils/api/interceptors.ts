import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import { shouldSkipRefresh, attemptTokenRefresh } from './token-refresh';

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(async (config) => {
    const token = await TokenStoreManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    (config as any)._startTime = Date.now();

    logger.log({ method: `${config.method?.toUpperCase()} =>`, path: config.url });

    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      const duration = Date.now() - ((res.config as any)._startTime || Date.now());
      const traceId =
        res.headers['x-trace-id'] || (res.config.headers['x-trace-id'] as string) || 'unknown';
      logger.log({
        method: `${res.config.method?.toUpperCase()} <=`,
        path: res.config.url,
        traceId,
        duration: `${duration}ms`,
      });
      return res;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      const duration = Date.now() - ((originalRequest as any)?._startTime || Date.now());
      const traceId =
        error.response?.headers?.['x-trace-id'] ||
        ((originalRequest?.headers as any)?.['x-trace-id'] as string) ||
        'unknown';
      logger.log({
        method: `${originalRequest?.method?.toUpperCase()} <=`,
        path: originalRequest?.url,
        traceId,
        duration: `${duration}ms`,
        status: error.response?.status,
      });

      if (
        !error.response ||
        error.response.status !== 401 ||
        !originalRequest ||
        shouldSkipRefresh(originalRequest.url)
      ) {
        return Promise.reject(error);
      }

      return attemptTokenRefresh(error, originalRequest, instance);
    }
  );
}
