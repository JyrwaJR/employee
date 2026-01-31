import { TokenStoreManager } from '@/src/libs/stores/auth';
import { executeNetworkRequest } from './fetcher';
import { ApiResponse, HeadersMap, HttpMethod } from '@/src/types/http';
import {
  buildError,
  handleHttpError,
  handleRefreshTokenAndRetry,
  isValidUrl,
  parseJsonSafe,
} from './helper';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';

export async function request<T>(
  method: HttpMethod,
  path: string,
  data?: unknown,
  extraHeaders?: HeadersMap
): Promise<ApiResponse<T>> {
  try {
    if (__DEV__) {
      console.log(`[HTTP] ${method} => ${path}`);
    }

    const token = await TokenStoreManager.getToken();

    const headers: HeadersMap = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };

    const url = path;

    if (!isValidUrl(url)) {
      return buildError<T>('Invalid URL');
    }

    let internalResponse;

    try {
      internalResponse = await executeNetworkRequest({
        url,
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
    } catch (error: any) {
      return buildError<T>(error.message || 'Request timeout');
    }

    const json = parseJsonSafe<any>(internalResponse.body);

    const refreshToken = await TokenStoreManager.getRefreshToken();

    const shouldRefreshToken =
      internalResponse.status === 401 &&
      path !== AUTH_ENDPOINTS.POST_LOGOUT &&
      path !== AUTH_ENDPOINTS.POST_SIGN_IN &&
      path !== AUTH_ENDPOINTS.POST_SIGN_UP &&
      refreshToken;

    if (shouldRefreshToken) {
      if (!path.includes(AUTH_ENDPOINTS.POST_REFRESH)) {
        return handleRefreshTokenAndRetry<T>(method, path, data, extraHeaders);
      }
    }
    if (internalResponse.status >= 400) {
      return buildError<T>(json?.message ?? 'Request failed', json?.error ?? json);
    }

    return {
      success: json?.success ?? true,
      message: json?.message ?? 'Request successful',
      data: (json?.data ?? null) as T | null,
      token: json?.token ?? undefined,
    };
  } catch (error) {
    return handleHttpError(error);
  }
}
