import { fetch as sslFetch } from 'react-native-ssl-pinning';
import z from 'zod';

/* ================================
   Config
================================ */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
const TIMEOUT = 10000;

if (!BASE_URL?.startsWith('https://')) {
  // Warn instead of throw in DEV to avoid crashing if env is missing
  if (__DEV__) console.warn('API URL is missing or not HTTPS');
  else throw new Error('API must use HTTPS');
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

// Unified internal response shape to handle both fetch and ssl-pinning
interface InternalResponse {
  status: number;
  body: string; // We will treat body as string for both initially
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

const isValidUrl = (url: string): boolean => {
  try {
    z.string().url().parse(url);
    return true;
  } catch (e) {
    return false;
  }
};

/* ================================
   Core Request
================================ */

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  extraHeaders?: HeadersMap
): Promise<ApiResponse<T>> {
  try {
    if (__DEV__) {
      console.log(`[HTTP] ${method} => ${path}`);
    }

    // const token = await getAccessToken();
    const token = '';

    const headers: HeadersMap = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };

    const url = `${BASE_URL}${path}`;

    if (!isValidUrl(url)) {
      return buildError<T>('Invalid URL');
    }

    // ---------------------------------------------------------
    //  SWITCH LOGIC: DEV (Standard Fetch) vs PROD (SSL Pinning)
    // ---------------------------------------------------------
    let internalResponse: InternalResponse;

    try {
      if (__DEV__) {
        // --- 1. Standard Fetch (Dev Mode) ---
        const raw = await withTimeout(
          fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
          }),
          TIMEOUT
        );

        const text = await raw.text();

        // Convert standard Headers to plain object
        const responseHeaders: HeadersMap = {};
        raw.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        internalResponse = {
          status: raw.status,
          body: text,
          headers: responseHeaders,
        };
      } else {
        // --- 2. SSL Pinning Fetch (Production) ---
        // Note: We use 'sslFetch' renamed import here
        const raw = await withTimeout(
          sslFetch(url, {
            method,
            timeoutInterval: TIMEOUT,
            sslPinning: { certs: ['api_cert'] },
            headers,
            body: body ? JSON.stringify(body) : undefined,
          }),
          TIMEOUT
        );

        internalResponse = {
          status: raw.status,
          // ssl-pinning returns 'bodyString' or 'body' depending on version/platform
          body: (raw as any).bodyString || raw.json(),
          headers: raw.headers,
        };
      }
    } catch (error: any) {
      return buildError<T>(error.message || 'Request timeout');
    }

    // ---------------------------------------------------------
    //  Unified Response Handling
    // ---------------------------------------------------------

    const json = parseJsonSafe<any>(internalResponse.body);

    if (internalResponse.status >= 400) {
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
