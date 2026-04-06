import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStoreManager } from '@/src/shared/store/token.store';
import { router } from 'expo-router';
import { queryClient } from './reactQuery';
import { routes } from '@/src/shared/constants/routes';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

/* -------------------------------------------------- */
/* State Management */
/* -------------------------------------------------- */

let isRefreshing = false;
let isExiting = false; // Flag to prevent multiple concurrent logout redirects
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  pendingQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  pendingQueue = [];
};

const shouldSkipRefresh = (url?: string) => {
  if (!url) return true;
  const skipUrls = ['/auth/refresh', '/auth/sign-in', '/auth/sign-up'];
  return skipUrls.some((path) => url.includes(path));
};

const handleUnauthorizedExit = async () => {
  if (isExiting) return;
  isExiting = true;

  try {
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();
    queryClient.clear(); // Clear cache so no stale data remains
    router.replace(routes.auth.login);
  } finally {
    // Reset after a delay to allow navigation to complete
    setTimeout(() => {
      isExiting = false;
    }, 2000);
  }
};

/* -------------------------------------------------- */
/* Interceptors */
/* -------------------------------------------------- */

axiosInstance.interceptors.request.use(async (config) => {
  const token = await TokenStoreManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. If not a 401 or shouldn't refresh, just fail
    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    // 2. If this is a SECOND 401 for the same request, refresh failed or token is still bad
    if (originalRequest._retry) {
      await handleUnauthorizedExit();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 3. Handle concurrent requests while refreshing
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

    /* ---------- Start Refresh ---------- */
    isRefreshing = true;

    try {
      const refreshToken = await TokenStoreManager.getRefreshToken();

      // Guard: If no refresh token exists, we can't refresh. Log out immediately.
      if (!refreshToken) {
        throw new Error('MISSING_REFRESH_TOKEN');
      }

      // Use standard axios instance for the refresh call
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
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

      // Successfully refreshed!
      processQueue(null, access_token);

      // Trigger React Query to refetch anything currently on screen
      queryClient.invalidateQueries();

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError: any) {
      // Clear queue early to prevent stale attempts
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
);

export default axiosInstance;
