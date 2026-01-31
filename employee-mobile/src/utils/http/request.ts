import { TokenStoreManager } from '@/src/libs/stores/auth';
import { executeNetworkRequest } from './fetcher';
import { ApiResponse, HeadersMap, HttpMethod } from '@/src/types/http';
import { buildError, handleHttpError, isValidUrl, parseJsonSafe } from './helper';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { BASE_URL } from './config';

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

    const url = `${BASE_URL}${path}`;

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
        return handleRefreshAndRetry<T>(method, path, data, extraHeaders);
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

async function handleRefreshAndRetry<T>(
  originalMethod: HttpMethod,
  originalPath: string,
  originalData: unknown,
  originalHeaders: HeadersMap | undefined
): Promise<ApiResponse<T>> {
  try {
    const refreshToken = await TokenStoreManager.getRefreshToken();
    if (!refreshToken) {
      return buildError<T>('Session expired. Please login again.');
    }
    const refreshUrl = `${BASE_URL}${AUTH_ENDPOINTS.POST_REFRESH}`;
    const refreshResponseRaw = await executeNetworkRequest({
      url: refreshUrl,
      method: 'POST',
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
    return request<T>(originalMethod, originalPath, originalData, originalHeaders);
  } catch {
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();
    return buildError<T>('Session expired.');
  }
}
