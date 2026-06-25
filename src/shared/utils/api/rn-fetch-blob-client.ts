import { encrypt, decrypt } from '@lib/encryption';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import RNFetchBlob from 'rn-fetch-blob';

const APP_ID = process.env.EXPO_PUBLIC_APP_ID;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const BASE_CONFIG = {
  trusty: true,
};

type DecryptedBackendResponse<T> = {
  status_code: string;
  message: string;
  success_flag: boolean;
  data?: T;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

function backendResponse<T>(data: DecryptedBackendResponse<T>): ApiResponse<T> {
  return {
    success: data.success_flag,
    message: data.message,
    data: data.data as T,
  };
}

async function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  headers: Record<string, string> = {},
  body?: any
): Promise<ApiResponse<T>> {
  const token = await TokenStoreManager.getAccessToken();
  const startTime = Date.now();

  let newBody;

  if (body) {
    const data = JSON.stringify(body);
    newBody = JSON.stringify({
      request_data: encrypt(data),
      app_id: APP_ID,
    });
  }

  const uri = `${API_URL}${url}`;

  logger.log({
    method: `${method} =>`,
    path: uri,
    functionName: body.functionName,
  });

  try {
    const response = await RNFetchBlob.config(BASE_CONFIG).fetch(
      method,
      uri,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      newBody
    );

    const duration = Date.now() - startTime;

    logger.log({
      method: `${method} <=`,
      path: uri,
      duration: `${duration}ms`,
      status: response.respInfo?.status,
    });

    if (!response.data) {
      return backendResponse<T>({
        message: 'No data returned',
        success_flag: false,
        status_code: '500',
      });
    }

    const parsed = JSON.parse(response.data);
    // Encrypted backend response
    const decrypted = decrypt<DecryptedBackendResponse<T>>(parsed.response);

    logger.log('decrypted', decrypted);
    return backendResponse<T>({
      success_flag: decrypted.success_flag,
      message: decrypted.message,
      data: decrypted.data as T,
      status_code: decrypted.status_code,
    });
  } catch (error: any) {
    throw error;
  }
}

export const rnFetchBlobClient = {
  get: <T = any>(url: string, headers?: Record<string, string>) => request<T>('GET', url, headers),

  post: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>('POST', url, headers, body),

  put: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>('PUT', url, headers, body),

  delete: <T = any>(url: string, headers?: Record<string, string>) =>
    request<T>('DELETE', url, headers),
};
