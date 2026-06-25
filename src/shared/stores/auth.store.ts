import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { UserT, RoleT } from '../types/auth';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/api/http';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';
import { rpc } from '@utils/api';
import { METHODS } from '@utils/constants';

type AuthStore = {
  user?: UserT | null;
  emp_cd: string;
  setEmpCode: (emp_cd: string) => void;
  isSignedIn: boolean;
  isAuthLoading: boolean;
  role: RoleT;

  fetchUser: () => Promise<void>;
  refresh: () => void;
  reset: () => void;
  logout: () => Promise<void>;
  _hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isSignedIn: false,
      isAuthLoading: true,
      emp_cd: '',
      setEmpCode: (emp_cd: string) => {
        set({ emp_cd });
      },
      role: 'USER' as RoleT,

      fetchUser: async (keepStaleOnError?: boolean) => {
        const empCode = get().emp_cd;
        logger.info('AuthStore: fetchUser called', { empCode, keepStaleOnError });
        if (empCode) {
          try {
            const res = await rpc<UserT>(METHODS.GET_EMP_DETAILS, { emp_cd: empCode });

            if (res.success && res.data) {
              logger.info('AuthStore: fetchUser success', { empCode });
              // TODO: Correct the role when change if needed
              set({ user: res.data, isSignedIn: true, role: 'USER' });
            } else {
              logger.warn('AuthStore: fetchUser returned no data', { empCode, res });
              get().reset();
            }
          } catch (error) {
            logger.error('AuthStore: fetchUser failed', error);
            if (!keepStaleOnError) {
              get().reset();
            }
          }
        } else {
          logger.warn('AuthStore: fetchUser skipped — emp_cd is empty');
        }
      },

      refresh: () => {
        get().fetchUser();
      },

      reset: () => {
        set({ user: null, isSignedIn: false, role: 'USER' });
      },

      logout: async () => {
        try {
          const refreshToken = await TokenStoreManager.getRefreshToken();
          if (refreshToken) {
            await http.post(ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken });
          }
        } catch (error) {
          logger.error('AuthStore: logout API call failed', error);
        }

        await TokenStoreManager.removeAccessToken();
        await TokenStoreManager.removeRefreshToken();
        get().reset();
        set({ emp_cd: '' });

        try {
          const { queryClient } = await import('@utils/react-query');
          queryClient.clear();
        } catch {}
      },

      _hydrate: async () => {
        logger.info('AuthStore: _hydrate started');
        const state = get();
        logger.info('AuthStore: current store state', {
          user: !!state.user,
          emp_cd: state.emp_cd,
          isSignedIn: state.isSignedIn,
        });
        try {
          const token = await TokenStoreManager.getAccessToken();
          logger.info('AuthStore: access token found', { hasToken: !!token });
          if (token) {
            await get().fetchUser();
          } else {
            const refreshToken = await TokenStoreManager.getRefreshToken();
            logger.info('AuthStore: refresh token found', { hasRefreshToken: !!refreshToken });
            if (refreshToken) {
              const res = await http.post<{ access_token: string; refresh_token?: string }>(
                ENDPOINTS.AUTH.REFRESH,
                { refresh_token: refreshToken }
              );
              logger.info('AuthStore: refresh result', {
                success: res.success,
                hasAccessToken: !!res.data?.access_token,
              });
              if (res.success && res.data?.access_token) {
                await TokenStoreManager.addAccessToken(res.data.access_token);
                if (res.data.refresh_token) {
                  await TokenStoreManager.addRefreshToken(res.data.refresh_token);
                }
                await get().fetchUser();
              } else {
                logger.warn('AuthStore: refresh failed');
                if (state.emp_cd) {
                  logger.info('AuthStore: trying direct fetch with stale emp_cd');
                  await get().fetchUser();
                } else {
                  set({ user: null, isSignedIn: false, role: 'USER' });
                }
              }
            } else {
              if (state.emp_cd) {
                logger.info('AuthStore: no tokens but stale emp_cd exists, trying direct fetch');
                await get().fetchUser();
              } else {
                logger.info('AuthStore: no tokens and no stale data, clearing session');
                set({ user: null, isSignedIn: false, role: 'USER', emp_cd: '' });
              }
            }
          }
        } catch (error) {
          logger.error('AuthStore: _hydrate failed', error);
        } finally {
          logger.info('AuthStore: _hydrate complete, setting isAuthLoading=false');
          set({ isAuthLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          const value = await SecureStore.getItemAsync(key);
          logger.info('AuthStore: persist getItem', { key, hasValue: !!value });
          return value;
        },
        setItem: async (key, value) => {
          logger.info('AuthStore: persist setItem', { key, size: value?.length });
          return SecureStore.setItemAsync(key, value);
        },
        removeItem: async (key) => {
          logger.info('AuthStore: persist removeItem', { key });
          return SecureStore.deleteItemAsync(key);
        },
      })),

      partialize: (state) => {
        const partial = {
          user: state.user,
          emp_cd: state.emp_cd,
          isSignedIn: state.isSignedIn,
          role: state.role,
          isAuthLoading: false,
        };
        logger.info('AuthStore: persist partialize', {
          hasUser: !!state.user,
          emp_cd: state.emp_cd,
          isSignedIn: state.isSignedIn,
        });
        return partial;
      },
    }
  )
);
