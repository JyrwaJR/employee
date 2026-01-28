import { fetch } from 'react-native-ssl-pinning';
// import { getAccessToken } from '../auth/tokenManager';

/* ================================
   Config
================================ */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
const TIMEOUT = 10000;

if (!BASE_URL.startsWith('https://')) {
  throw new Error('API must use HTTPS');
}

/* ================================
   Types
================================ */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | Record<string, unknown>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type HeadersMap = Record<string, string>;

interface PinningResponse {
  status: number;
  body: string;
  headers: HeadersMap;
}

/* ================================
   Helpers
================================ */

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)),
  ]);

const parseJsonSafe = <T>(text: string): T | null => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const buildError = <T>(message: string, error?: unknown): ApiResponse<T> => ({
  success: false,
  message,
  data: null,
  error: typeof error === 'string' || typeof error === 'object' ? (error as any) : undefined,
});

/* ================================
   Core request (ssl-pinning safe)
================================ */

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  extraHeaders?: HeadersMap
): Promise<ApiResponse<T>> {
  try {
    if (__DEV__) {
      console.log(`[HTTP] ${method} =>`, path);
    }

    // const token = await getAccessToken();
    const token = '';

    const headers: HeadersMap = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };

    const raw = await withTimeout(
      fetch(`${BASE_URL}${path}`, {
        method,
        timeoutInterval: TIMEOUT,
        sslPinning: { certs: ['api_cert'] },
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
      TIMEOUT
    );

    const response = raw as unknown as PinningResponse;

    const json = parseJsonSafe<any>(response.body);

    if (response.status >= 400) {
      return buildError<T>(json?.message ?? 'Request failed', json?.error ?? json);
    }

    return {
      success: json?.success ?? true,
      message: json?.message ?? 'Request successful',
      data: (json?.data ?? null) as T | null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return buildError<T>(error.message);
    }

    return buildError<T>('Something went wrong');
  }
}

/* ================================
   Public client
================================ */

export const http = {
  get: <T>(url: string, headers?: HeadersMap) => request<T>('GET', url, undefined, headers),

  post: <T>(url: string, data?: object, headers?: HeadersMap) =>
    request<T>('POST', url, data, headers),

  put: <T>(url: string, data?: object, headers?: HeadersMap) =>
    request<T>('PUT', url, data, headers),

  delete: <T>(url: string, headers?: HeadersMap) => request<T>('DELETE', url, undefined, headers),
};
