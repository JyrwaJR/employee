import { AxiosError, AxiosInstance, InternalAxiosRequestConfig, isCancel } from 'axios';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import { attemptTokenRefresh, shouldSkipRefresh } from './token-refresh';
import { decrypt, encrypt } from '@lib/encryption';
import { cleanupSession } from './session-cleanup';

const APP_ID = process.env.EXPO_PUBLIC_APP_ID;

/**
 * Attaches request and response interceptors to an Axios instance.
 *
 * **Request interceptor:** Injects the Bearer token from secure storage, encrypts
 * the request payload (unless disabled), tags the start time for latency tracking,
 * and logs the outgoing method and path.
 *
 * **Response interceptor:** Decrypts the backend envelope response, handles 401
 * status codes by clearing the session and redirecting to login, and triggers
 * automatic token refresh on 401 errors (with a retry queue to avoid race conditions).
 *
 * @param instance - The Axios instance to attach interceptors to.
 * @param options - Optional configuration.
 * @param options.encryption - Whether to enable encryption of request/response data (default `true`).
 */
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
          await cleanupSession();
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

      // Cancelled requests are intentional — let http.ts handle the logging
      if (isCancel(error)) {
        return Promise.reject(error);
      }

      // Distinguish network-level failures from server responses for clearer diagnostics
      if (!error.response) {
        logger.warn('NETWORK_ERROR', {
          code: error.code,
          message: error.message,
          method: originalRequest?.method?.toUpperCase(),
          path: originalRequest?.url,
        });
      } else {
        logger.warn('HTTP_ERROR', {
          status: error.response.status,
          statusText: error.response.statusText,
          method: originalRequest?.method?.toUpperCase(),
          path: originalRequest?.url,
        });
      }

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
