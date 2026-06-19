import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { TokenStoreManager } from '@stores/token.store';
import { router } from 'expo-router';
import { queryClient } from '../react-query';
import { PAGE_ROUTES } from '@utils/constants';
import { AUTH_ENDPOINT } from '@features/auth/utils/constants';

let isRefreshing = false;
let isExiting = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

function processQueue(error: any, token: string | null = null) {
  pendingQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  pendingQueue = [];
}

export function shouldSkipRefresh(url?: string) {
  if (!url) return true;
  const skipUrls = [
    AUTH_ENDPOINT.LOGIN,
    AUTH_ENDPOINT.SIGN_UP,
    AUTH_ENDPOINT.REFRESH,
    AUTH_ENDPOINT.LOGOUT,
    AUTH_ENDPOINT.FORGOT_PASSWORD,
    AUTH_ENDPOINT.GET_OTP,
    AUTH_ENDPOINT.VERIFY_OTP,
  ];
  return skipUrls.some((path) => url.includes(path));
}

async function handleUnauthorizedExit() {
  if (isExiting) return;
  isExiting = true;

  try {
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();
    queryClient.clear();
    router.replace(PAGE_ROUTES.AUTH.LOGIN);
  } finally {
    setTimeout(() => {
      isExiting = false;
    }, 2000);
  }
}

export async function attemptTokenRefresh(
  error: AxiosError,
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  axiosInstance: AxiosInstance
) {
  if (originalRequest._retry) {
    await handleUnauthorizedExit();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({
        resolve: (token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        },
        reject: (err: any) => reject(err),
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = await TokenStoreManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('MISSING_REFRESH_TOKEN');
    }

    const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}${AUTH_ENDPOINT.REFRESH}`, {
      refresh_token: refreshToken,
    });

    const payload: any = res.data;
    const access_token = payload?.data?.access_token ?? payload?.access_token;
    const new_refresh_token = payload?.data?.refresh_token ?? payload?.refresh_token;

    if (!access_token) {
      throw new Error('Invalid refresh response');
    }

    await TokenStoreManager.addToken(access_token);
    if (new_refresh_token) {
      await TokenStoreManager.addRefreshToken(new_refresh_token);
    }

    processQueue(null, access_token);
    queryClient.invalidateQueries();

    originalRequest.headers.Authorization = `Bearer ${access_token}`;
    return axiosInstance(originalRequest);
  } catch (refreshError: any) {
    processQueue(refreshError, null);

    const status = refreshError?.response?.status;
    if (status === 400 || status === 401 || refreshError.message === 'MISSING_REFRESH_TOKEN') {
      await handleUnauthorizedExit();
    }

    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}
