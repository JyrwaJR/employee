import axios from 'axios';
import { setupInterceptors } from './interceptors';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: 'Request timed out. Please try again.',
});

setupInterceptors(axiosInstance);

export default axiosInstance;
