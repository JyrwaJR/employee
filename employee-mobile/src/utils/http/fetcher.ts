import { fetch as sslFetch } from 'react-native-ssl-pinning';
import { TIMEOUT } from './config';
import { HeadersMap, HttpMethod, InternalResponse } from '@/src/types/http';
import { withTimeout } from './helper';

interface FetcherParams {
  url: string;
  method: HttpMethod;
  headers: HeadersMap;
  body?: string;
}

export async function executeNetworkRequest({
  url,
  method,
  headers,
  body,
}: FetcherParams): Promise<InternalResponse> {
  // --- 1. Standard Fetch (Dev Mode) ---
  if (__DEV__) {
    const raw = await withTimeout(
      fetch(url, {
        method,
        headers,
        body,
      }),
      TIMEOUT
    );

    const text = await raw.text();

    // Normalize headers
    const responseHeaders: HeadersMap = {};
    raw.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: raw.status,
      body: text,
      headers: responseHeaders,
    };
  }

  // --- 2. SSL Pinning Fetch (Production) ---
  else {
    const raw = await withTimeout(
      sslFetch(url, {
        method,
        timeoutInterval: TIMEOUT,
        sslPinning: { certs: ['api_cert'] },
        headers,
        body,
      }),
      TIMEOUT
    );

    return {
      status: raw.status,
      body:
        (raw as any).bodyString ||
        // @ts-ignore
        (typeof raw.body === 'string' ? raw.body : JSON.stringify(raw.json())),
      headers: raw.headers,
    };
  }
}
