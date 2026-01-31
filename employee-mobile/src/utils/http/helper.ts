import z from 'zod';
import { ApiResponse } from '@/src/types/http';

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)),
  ]);

export const parseJsonSafe = <T>(text: string): T | null => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const buildError = <T>(message: string, error?: unknown): ApiResponse<T> => ({
  success: false,
  message,
  data: null,
  error: typeof error === 'string' || typeof error === 'object' ? (error as any) : undefined,
});

export const isValidUrl = (url: string): boolean => {
  try {
    z.url().parse(url);
    return true;
  } catch (e) {
    if (__DEV__) {
      console.log(e);
    }
    return false;
  }
};

export const handleHttpError = (error: unknown): ApiResponse<null | any> => {
  if (error instanceof Error) {
    return buildError<null>(error.message);
  }
  return buildError<null>('Something went wrong');
};
