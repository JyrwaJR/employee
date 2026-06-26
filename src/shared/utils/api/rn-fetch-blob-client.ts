import { encrypt, decrypt } from '@lib/encryption';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '../logger/logger';
import RNFetchBlob from 'rn-fetch-blob';
import { METHODS } from '@utils/constants';
import { HttpClient } from '@sharedTypes/api';

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

    logger.log('Encrypted Body', {
      encrypted: JSON.parse(newBody),
      unencrypted: body,
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

    logger.log('Decrypted Response', {
      success: decrypted.success_flag,
      message: decrypted.message,
      method: body.functionName,
      response_status: decrypted.status_code,
      http_status: response.respInfo.status,
    });

    if (decrypted.status_code === '401' && body.functionName !== METHODS.EMP_LOGIN) {
      await TokenStoreManager.removeAccessToken();
    }

    const data = typeof decrypted.data === 'string' ? JSON.parse(decrypted.data) : decrypted.data;

    return backendResponse<T>({
      success_flag: decrypted.success_flag,
      message: decrypted.message,
      data: data as T,
      status_code: decrypted.status_code,
    });
  } catch (error: any) {
    throw error;
  }
}

export const rnFetchBlobClient: HttpClient = {
  get: (url, config) => request('GET', url, config?.headers as Record<string, string>),

  post: (url, data, config) =>
    request('POST', url, config?.headers as Record<string, string>, data),

  put: (url, data, config) => request('PUT', url, config?.headers as Record<string, string>, data),

  delete: (url, config) => request('DELETE', url, config?.headers as Record<string, string>),
};
