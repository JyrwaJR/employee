
import { AxiosResponse } from 'axios';
import axiosInstance from '../api';
import { TIMEOUT } from './config';
import { HeadersMap, HttpMethod, InternalResponse } from '@/src/types/http';

interface FetcherParams {
  url: string;
  method: HttpMethod;
  headers: HeadersMap;
  body?: any; // Axios handles objects/strings automatically
}

export async function executeNetworkRequest({
  url,
  method,
  headers,
  body,
}: FetcherParams): Promise<InternalResponse> {
  try {
    const response: AxiosResponse = await axiosInstance({
      url,
      method,
      headers,
      data: body,
      timeout: TIMEOUT,
    });

    return {
      status: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: response.headers as unknown as HeadersMap,
    };
  } catch (error: any) {
    // If SSL Pinning fails, Axios will throw a Network Error here
    if (error.message === 'Network Error') {
      return {
        status: 500,
        body: "Pinning failed. Please check your device's security settings.",
        headers: {},
      };
    }

    return {
      status: error.response?.status || 500,
      body: error.response?.data || error.message,
      headers: error.response?.headers || {},
    };
  }
}
