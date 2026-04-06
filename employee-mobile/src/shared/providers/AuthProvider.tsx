import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/shared/context/auth.context';
import { api } from '@/src/shared/api';
import { TokenStoreManager } from '@/src/shared/store/token.store';
import { AuthContextT, UserT } from '@/src/shared/types/auth'; // Updated to Shared Types
import { http } from '@/src/shared/utils/http';
import { useRouter } from 'expo-router';
import { logger } from '@/src/shared/utils/logger';
import { queryKeys } from '@/src/shared/api/query-keys';
import { routes } from '@/src/shared/constants/routes';

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
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTokenSet, setIsTokenSet] = useState(false);

  const logout = useCallback(async () => {
    logger.info('AuthProvider: Initiating global logout');
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();
    setIsTokenSet(false);

    queryClient.setQueryData(queryKeys.auth.me, null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    router.replace(routes.auth.login);
  }, [queryClient, router]);

  const attemptSilentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = await TokenStoreManager.getRefreshToken();
      if (!refreshToken) return false;

      const res = await http.post<{ refresh_token: string; access_token: string }>(
        api.auth.refresh,
        { refresh_token: refreshToken }
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
  }, []);

  // Bootstrap logic
  useEffect(() => {
    let mounted = true;
    const bootstrapAsync = async () => {
      try {
        const accessToken = await TokenStoreManager.getToken();
        if (accessToken) {
          if (mounted) setIsTokenSet(true);
        } else {
          const refreshed = await attemptSilentRefresh();
          if (mounted) setIsTokenSet(refreshed);
        }
      } catch (e) {
        logger.error('AuthProvider: Bootstrap Failure', e);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    bootstrapAsync();
    return () => { mounted = false; };
  }, [attemptSilentRefresh]);

  // Session validation loop
  useEffect(() => {
    if (!isTokenSet) return;
    const validateSessionOnce = async () => {
      const isValid = await attemptSilentRefresh();
      if (!isValid) {
        await logout();
      }
    };
    validateSessionOnce();
  }, [isTokenSet, attemptSilentRefresh, logout]);

  // Profile Fetching
  const {
    data: user,
    isFetching: isFetchingUser,
    refetch,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => await http.get<UserT>(api.auth.me),
    enabled: isTokenSet,
    retry: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  const isSignedIn = !!user;

  const value: AuthContextT = {
    user: user || null,
    isSignedIn,
    refresh: refetch,
    isLoading: isInitializing || isFetchingUser,
    role: user?.role || 'USER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
