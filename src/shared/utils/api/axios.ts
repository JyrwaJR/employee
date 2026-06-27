import axios from 'axios';
import { setupInterceptors } from './interceptors';

export function createAxiosInstance(options?: { encryption?: boolean }) {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 10000,
    timeoutErrorMessage: 'Request timed out. Please try again.',
  });

  setupInterceptors(instance, options);

  return instance;
}

const axiosInstance = createAxiosInstance({ encryption: true });

const axiosInstanceWithoutEncryption = createAxiosInstance();

export default axiosInstance;

export { axiosInstanceWithoutEncryption };
