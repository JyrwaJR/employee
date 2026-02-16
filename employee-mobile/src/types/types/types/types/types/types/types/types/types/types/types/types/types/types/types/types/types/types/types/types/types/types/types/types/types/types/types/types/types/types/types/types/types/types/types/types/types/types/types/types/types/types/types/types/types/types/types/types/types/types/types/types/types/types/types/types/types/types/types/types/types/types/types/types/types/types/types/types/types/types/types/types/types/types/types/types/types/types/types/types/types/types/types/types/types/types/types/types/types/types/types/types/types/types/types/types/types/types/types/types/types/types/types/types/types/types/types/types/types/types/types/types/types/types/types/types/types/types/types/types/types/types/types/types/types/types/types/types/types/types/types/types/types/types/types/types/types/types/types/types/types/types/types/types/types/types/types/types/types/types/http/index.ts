export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HeadersMap = Record<string, string>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  token?: string;
  error?: string | Record<string, unknown>;
}

// Unified internal response shape to handle both fetch and ssl-pinning
export interface InternalResponse {
  status: number;
  body: string;
  headers: HeadersMap;
}
