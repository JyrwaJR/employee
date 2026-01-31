import z from 'zod';
import { ApiResponse, HeadersMap, HttpMethod } from '@/src/types/http';
import { TokenStoreManager } from '@/src/libs/stores/auth';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { BASE_URL } from './config';
import { executeNetworkRequest } from './fetcher';
import { request } from './request';

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)),
  ]);

export const parseJsonSafe = <T>(text: string): T | null => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const buildError = <T>(message: string, error?: unknown): ApiResponse<T> => ({
  success: false,
  message,
  data: null,
  error: typeof error === 'string' || typeof error === 'object' ? (error as any) : undefined,
});

export const isValidUrl = (url: string): boolean => {
  try {
    z.url().parse(url);
    return true;
  } catch (e) {
    if (__DEV__) {
      console.log(e);
    }
    return false;
  }
};

export const handleHttpError = (error: unknown): ApiResponse<null | any> => {
  if (error instanceof Error) {
    return buildError<null>(error.message);
  }
  return buildError<null>('Something went wrong');
};

export async function handleRefreshTokenAndRetry<T>(
  originalMethod: HttpMethod,
  originalPath: string,
  originalData: unknown,
  originalHeaders: HeadersMap | undefined
): Promise<ApiResponse<T>> {
  try {
    // 1. Get the Refresh Token
    const refreshToken = await TokenStoreManager.getRefreshToken();
    if (!refreshToken) {
      return buildError<T>('Session expired. Please login again.');
    }

    const refreshUrl = `${BASE_URL}${AUTH_ENDPOINTS.POST_REFRESH}`;

    const refreshResponseRaw = await executeNetworkRequest({
      url: refreshUrl,
      method: 'POST', // Usually refresh is a POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const refreshJson = parseJsonSafe<any>(refreshResponseRaw.body);

    if (refreshResponseRaw.status >= 400 || !refreshJson?.success) {
      await TokenStoreManager.removeToken();
      await TokenStoreManager.removeRefreshToken();
      return buildError<T>('Session expired. Please login again.');
    }

    const { access_token, refresh_token: new_refresh_token } = refreshJson.data;

    await TokenStoreManager.addToken(access_token);
    if (new_refresh_token) {
      await TokenStoreManager.addRefreshToken(new_refresh_token);
    }

    // Since we just updated the store, it will pick up the new token automatically.
    return request<T>(originalMethod, originalPath, originalData, originalHeaders);
  } catch (error) {
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();
    return buildError<T>('Session expired.');
  }
}
