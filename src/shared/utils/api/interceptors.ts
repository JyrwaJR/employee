import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import { attemptTokenRefresh, shouldSkipRefresh } from './token-refresh';
import { decrypt, encrypt } from '@lib/encryption';

const APP_ID = process.env.EXPO_PUBLIC_APP_ID;

export function setupInterceptors(instance: AxiosInstance, options?: { encryption?: boolean }) {
  instance.interceptors.request.use(async (config) => {
    const token = await TokenStoreManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data && options?.encryption !== false) {
      config.data = {
        request_data: encrypt(JSON.stringify(config.data)),
        app_id: APP_ID,
      };
    }

    (config as any)._startTime = Date.now();

    logger.log({ method: `${config.method?.toUpperCase()} =>`, path: config.url });

    return config;
  });

  instance.interceptors.response.use(
    async (res) => {
      if (res.data?.response && options?.encryption !== false) {
        const decrypted = decrypt<{
          status_code: string;
          message: string;
          success_flag: boolean;
          data?: any;
        }>(res.data?.response);

        let data = decrypted.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {}
        }

        if (decrypted.status_code === '401') {
          console.log('Unauthorized Removing Token');
          await TokenStoreManager.removeAccessToken();
          const { useAuthStore } = await import('@stores/auth.store');
          useAuthStore.getState().reset();
        }

        logger.log('Decrypted Response', {
          success: decrypted.success_flag,
          message: decrypted.message,
          response_status: decrypted.status_code,
          http_status: res.status,
        });

        res.data = {
          success: decrypted.success_flag,
          message: decrypted.message,
          data: data,
        };
      }
      return res;
    },
    async (error: AxiosError) => {
      logger.log('INTERCEPTOR ERROR', error);
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
