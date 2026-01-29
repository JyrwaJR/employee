import { TokenStoreManager } from '@/src/libs/stores/auth';
import { BASE_URL } from './config';
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

    // 1. Get Token
    const token = await TokenStoreManager.getToken();

    // 2. Prepare Request
    const headers: HeadersMap = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };

    const url = `${BASE_URL}${path}`;

    if (!isValidUrl(url)) {
      return buildError<T>('Invalid URL');
    }

    // 3. Execute Request (via Fetcher Adapter)
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

    // 4. Parse Response
    const json = parseJsonSafe<any>(internalResponse.body);

    // 5. Handle HTTP Errors (4xx, 5xx)
    if (internalResponse.status === 401) {
      // SAFETY CHECK: Prevent Infinite Loops
      // If the request failing IS the refresh endpoint, do not try to refresh again.
      if (!path.includes(AUTH_ENDPOINTS.POST_REFRESH)) {
        return handleRefreshTokenAndRetry<T>(method, path, data, extraHeaders);
      }
    }
    if (internalResponse.status >= 400) {
      return buildError<T>(json?.message ?? 'Request failed', json?.error ?? json);
    }

    // 6. Return Success
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
