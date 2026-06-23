import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { UserT, RoleT } from '@types/auth';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/api/http';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';

type AuthStore = {
  user: UserT | null;
  isSignedIn: boolean;
  isAuthLoading: boolean;
  role: RoleT;

  setUser: (user: UserT | null) => void;
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
      role: 'USER' as RoleT,

      setUser: (user) =>
        set({
          user,
          isSignedIn: user !== null,
          role: user?.role ?? 'USER',
        }),

      fetchUser: async () => {
        try {
          const res = await http.get<UserT>(ENDPOINTS.AUTH.ME);
          if (res.success && res.data) {
            get().setUser(res.data);
          } else {
            get().reset();
          }
        } catch (error) {
          logger.error('AuthStore: fetchUser failed', error);
          get().reset();
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

        await TokenStoreManager.removeToken();
        await TokenStoreManager.removeRefreshToken();
        get().reset();

        try {
          const { queryClient } = await import('@utils/react-query');
          queryClient.clear();
        } catch {}
      },

      _hydrate: async () => {
        set({ isAuthLoading: true });
        try {
          const token = await TokenStoreManager.getToken();
          if (token) {
            await get().fetchUser();
          } else {
            const refreshToken = await TokenStoreManager.getRefreshToken();
            if (refreshToken) {
              const res = await http.post<{ access_token: string; refresh_token?: string }>(
                ENDPOINTS.AUTH.REFRESH,
                { refresh_token: refreshToken }
              );
              if (res.success && res.data?.access_token) {
                await TokenStoreManager.addToken(res.data.access_token);
                if (res.data.refresh_token) {
                  await TokenStoreManager.addRefreshToken(res.data.refresh_token);
                }
                await get().fetchUser();
              } else {
                get().reset();
              }
            } else {
              get().reset();
            }
          }
        } catch (error) {
          logger.error('AuthStore: _hydrate failed', error);
          get().reset();
        } finally {
          set({ isAuthLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.isSignedIn = true;
          state.role = state.user.role;
        }
        if (state) {
          state.isAuthLoading = true;
        }
      },
    }
  )
);
