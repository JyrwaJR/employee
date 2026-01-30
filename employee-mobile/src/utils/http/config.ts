export const TIMEOUT = 10000;

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

if (!BASE_URL?.startsWith('https://')) {
  if (__DEV__) {
    console.warn('⚠️ API URL is missing or not HTTPS');
  } else {
    throw new Error('API must use HTTPS');
  }
}
