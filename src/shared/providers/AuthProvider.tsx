import React, { useEffect, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/shared/providers/auth.context';
import { ENDPOINTS } from '@/src/shared/constants/endpoints';
import { TokenStoreManager } from '@/src/shared/stores/token.store';
import { AuthContextT, UserT } from '@/src/shared/types/auth'; // Updated to Shared Types
import { http } from '@/src/shared/utils/http';
import { logger } from '@/src/shared/utils/logger';
import { queryKeys } from '@/src/shared/constants/query-keys';
import { toast } from '@/src/shared/components/ui';

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

  /**
   * logoutMutation handles the server-side logout process.
   * It calls the logout API and, regardless of the API response (success or failure),
   * it performs a "fail-safe" cleanup of the local session by removing tokens
   * and purging the user profile from the query cache.
   */
  const logoutMutation = useMutation({
    mutationFn: ({ refresh_token }: { refresh_token: string }) =>
      http.post(ENDPOINTS.AUTH.LOGOUT, { refresh_token }),
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
      if (data?.success) {
        toast.success('Session Ended', {
          description: data.message || 'You have been signed out',
        });
      } else {
        toast.error('Logout Error', {
          description: data?.message || 'Could not complete logout',
        });
      }

      setIsInitializing(false);
    },
  });

  /**
   * logout is a memoized callback used to trigger the logout flow.
   * It retrieves the refresh token from secure storage and passes it to the logoutMutation.
   */
  const logout = useCallback(async () => {
    const refreshToken = await TokenStoreManager.getRefreshToken();
    if (refreshToken) {
      await logoutMutation.mutateAsync({ refresh_token: refreshToken });
    }
    // eslint-disable-next-line
  }, []);

  /**
   * attemptSilentRefresh attempts to renew the user's access token using the refresh token.
   * This is used during app bootstrap and periodically to keep the session alive.
   *
   * @param {AbortSignal} [signal] - Optional signal to cancel the request.
   * @returns {Promise<boolean>} Resolves to true if the refresh was successful, false otherwise.
   */
  const attemptSilentRefresh = useCallback(
    async (signal?: AbortSignal): Promise<boolean> => {
      try {
        if (!isTokenSet) return false;

        const refreshToken = await TokenStoreManager.getRefreshToken();

        if (!refreshToken) return false;

        const res = await http.post<{ refresh_token: string; access_token: string }>(
          ENDPOINTS.AUTH.REFRESH,
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

  /**
   * Bootstrap Effect
   * Runs once on mount to check for existing session tokens.
   * If an access token exists, it sets the session as active.
   * If not, it attempts a silent refresh before marking initialization as complete.
   */
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

  /**
   * Session Validation Effect
   * Performed whenever a token is set or refreshed.
   * It validates the current session once to ensure synchronization between local storage and backend.
   */
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

  /**
   * Profile Fetching Query
   * Automatically fetches the user's profile data once a valid token is confirmed.
   * Uses TanStack Query for caching and synchronization.
   */
  const {
    data: user,
    isFetching: isFetchingUser,
    refetch,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async ({ signal }) => await http.get<UserT>(ENDPOINTS.AUTH.ME, { signal }),
    enabled: isTokenSet,
    retry: false,
    select: (data) => data.data,
  });

  /**
   * Session Termination Effect
   * Monitors the profile query for errors (e.g., 401 Unauthorized).
   * If the session is invalid, it triggers the logout cleanup.
   */
  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  /** Derived state to check if the user is fully authenticated */
  const isSignedIn = !!user && isTokenSet;

  /**
   * Memoized Auth Context Value
   * Provided to the rest of the application via useAuth hook.
   */
  const value: AuthContextT = {
    user: user || null,
    isSignedIn,
    /** Triggers a re-check of tokens and profile refetch */
    refresh: () => {
      setIsTokenSet(true);
      refetch();
    },
    /** Combined loading state for bootstrap, fetching, and logout operations */
    isLoading:
      (isSignedIn ? isInitializing || isFetchingUser : isInitializing) || logoutMutation.isPending,
    role: user?.role || 'USER',
    logout: logout,
  } satisfies AuthContextT;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
