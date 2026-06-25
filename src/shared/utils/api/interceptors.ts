import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import { shouldSkipRefresh, attemptTokenRefresh } from './token-refresh';
import { decrypt, encrypt } from '@lib/encryption';

const APP_ID = process.env.EXPO_PUBLIC_APP_ID;

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(async (config) => {
    const token = await TokenStoreManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
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
    (res) => {
      if (res.data?.response) {
        const decrypted = decrypt<string>(res.data?.response);
        try {
          res.data = JSON.parse(decrypted);
        } catch {
          res.data = decrypted;
        }
      }
      return res;
    },
    async (error: AxiosError) => {
      console.log('INTERCEPTOR ERROR', error);
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
