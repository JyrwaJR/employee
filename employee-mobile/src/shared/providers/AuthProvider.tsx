import React, { useEffect, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/shared/context/auth.context';
import { api } from '@/src/shared/api';
import { TokenStoreManager } from '@/src/shared/store/token.store';
import { AuthContextT, UserT } from '@/src/shared/types/auth'; // Updated to Shared Types
import { http } from '@/src/shared/utils/http';
import { logger } from '@/src/shared/utils/logger';
import { queryKeys } from '@/src/shared/api/query-keys';
import { notify } from '../utils/notify';

type Props = {
  children: React.ReactNode;
};

/**
 * Global Authentication Provider
 *
 * Manages the core identity lifecycle:
 * 1. Bootstrap: Verifies existing tokens on app launch.
 * 2. Profile Sync: Fetches and caches the current user profile.
 * 3. Silent Refresh: Automatically handles session renewal.
 * 4. Error Recovery: Redirects to login on terminal session failure.
 */
export const AuthContextProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTokenSet, setIsTokenSet] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: ({ refresh_token }: { refresh_token: string }) =>
      http.post(api.auth.logout, { refresh_token }),
    onSettled: async (data) => {
      // Fail-safe cleanup: Always clear local session even if API fails
      setIsInitializing(true);
      setIsTokenSet(false);
      logger.info('AuthProvider: Initiating global logout cleanup');

      // 1. Clear Session State (Triggers Query Disable)
      await TokenStoreManager.removeToken();
      await TokenStoreManager.removeRefreshToken();

      // 2. Purge Cache
      queryClient.setQueryData(queryKeys.auth.me, null);
      notify(data, 'AUTH_LOGOUT');

      setIsInitializing(false);
    },
  });

  const logout = useCallback(async () => {
    const refreshToken = await TokenStoreManager.getRefreshToken();
    if (refreshToken) {
      await logoutMutation.mutateAsync({ refresh_token: refreshToken });
    }
    // eslint-disable-next-line
  }, []);

  const attemptSilentRefresh = useCallback(
    async (signal?: AbortSignal): Promise<boolean> => {
      try {
        if (!isTokenSet) return false;

        const refreshToken = await TokenStoreManager.getRefreshToken();

        if (!refreshToken) return false;

        const res = await http.post<{ refresh_token: string; access_token: string }>(
          api.auth.refresh,
          { refresh_token: refreshToken },
          { signal }
        );

        if (res.success && res.data) {
          const { access_token, refresh_token: new_refresh_token } = res.data;
          await TokenStoreManager.addToken(access_token);
          if (new_refresh_token) {
            await TokenStoreManager.addRefreshToken(new_refresh_token);
          }
          return true;
        }
        return false;
      } catch (error) {
        logger.error('AuthProvider: Silent Refresh Error', error);
        return false;
      }
    },
    [isTokenSet]
  );

  // Bootstrap logic
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const bootstrapAsync = async () => {
      try {
        const accessToken = await TokenStoreManager.getToken();
        if (accessToken) {
          if (mounted) setIsTokenSet(true);
        } else {
          const refreshed = await attemptSilentRefresh(controller.signal);
          if (mounted) setIsTokenSet(refreshed);
        }
      } catch (e) {
        logger.error('AuthProvider: Bootstrap Failure', e);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    bootstrapAsync();

    return () => {
      mounted = false;
    };
  }, [attemptSilentRefresh]);

  useEffect(() => {
    let mounted = true;
    const validateSessionOnce = async () => {
      const isValid = await attemptSilentRefresh();
      if (!isValid && mounted) {
        await logout();
      }
    };
    if (isTokenSet) {
      validateSessionOnce();
    }
    return () => {
      mounted = false;
    };
  }, [isTokenSet, attemptSilentRefresh, logout]);

  // Profile Fetching
  const {
    data: user,
    isFetching: isFetchingUser,
    refetch,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async ({ signal }) => await http.get<UserT>(api.auth.me, { signal }),
    enabled: isTokenSet,
    retry: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  const isSignedIn = !!user && isTokenSet;

  const value: AuthContextT = {
    user: user || null,
    isSignedIn,
    refresh: () => {
      setIsTokenSet(true);
      refetch();
    },
    isLoading:
      (isSignedIn ? isInitializing || isFetchingUser : isInitializing) || logoutMutation.isPending,
    role: user?.role || 'USER',
    logout: logout,
  } satisfies AuthContextT;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
