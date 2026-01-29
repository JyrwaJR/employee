import { HeadersMap } from '@/src/types/http';
import { request } from './request';

export const http = {
  get: <T>(url: string, headers?: HeadersMap) => request<T>('GET', url, undefined, headers),

  post: <T>(url: string, data?: object, headers?: HeadersMap) =>
    request<T>('POST', url, data, headers),

  put: <T>(url: string, data?: object, headers?: HeadersMap) =>
    request<T>('PUT', url, data, headers),

  delete: <T>(url: string, headers?: HeadersMap) => request<T>('DELETE', url, undefined, headers),
};
