import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/src/libs/context/auth';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { TokenStoreManager } from '@/src/libs/stores/auth';
import { AuthContextT, UserT } from '@/src/types/context/auth';
import { http } from '@/src/utils/http';
import { LoadingScreen } from '../../common/LoadingScreen';
import { useRouter } from 'expo-router';

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // State
  const [isInitializing, setIsInitializing] = useState(true); // App startup loading state
  const [isTokenSet, setIsTokenSet] = useState(false); // Do we have a token to fetch user?

  // --- 1. Helper: Clear everything and kick user out ---
  const logout = useCallback(async () => {
    console.log('🔒 Logging out & clearing storage...');
    await TokenStoreManager.removeToken();
    await TokenStoreManager.removeRefreshToken();

    // Reset internal state
    setIsTokenSet(false);

    // Clear React Query cache (removes User data)
    queryClient.setQueryData(['me'], null);
    queryClient.removeQueries({ queryKey: ['me'] });
    router.replace('/auth');
  }, [queryClient, router]);

  // --- 2. Helper: Attempt Silent Refresh ---
  // Returns true if session is valid/renewed, false if invalid
  const attemptSilentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      // Assuming you have a specific REFRESH endpoint.
      // Do NOT use logout endpoint here.
      const refreshToken = await TokenStoreManager.getRefreshToken();

      if (!refreshToken) return false;

      // Call your API to refresh
      const res = await http.post<{ refresh_token: string; access_token: string }>(
        AUTH_ENDPOINTS.POST_REFRESH, // <--- Make sure this is your refresh endpoint
        { refresh_token: refreshToken }
      );

      if (res.success && res.data) {
        console.log('✅ Background refresh successful');
        const { access_token, refresh_token: new_refresh_token } = res.data;

        // Update storage with fresh tokens
        await TokenStoreManager.addToken(access_token);
        if (new_refresh_token) {
          await TokenStoreManager.addRefreshToken(new_refresh_token);
        }
        return true;
      }

      console.warn('⚠️ Refresh failed - invalid token');
      return false;
    } catch (error) {
      console.error('❌ Error during silent refresh:', error);
      return false;
    }
  }, []);

  // --- 3. Initial App Startup Check ---
  useEffect(() => {
    let mounted = true;

    const bootstrapAsync = async () => {
      try {
        // First, do we have an access token?
        const accessToken = await TokenStoreManager.getToken();

        if (accessToken) {
          // Yes -> Ready to fetch user
          if (mounted) setIsTokenSet(true);
        } else {
          // No Access Token -> Try to use Refresh Token immediately
          const refreshed = await attemptSilentRefresh();
          if (mounted) setIsTokenSet(refreshed);
        }
      } catch (e) {
        // Fallback: If anything crashes, assume logged out
        console.error('Bootstrap error', e);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    bootstrapAsync();

    return () => {
      mounted = false;
    };
  }, [attemptSilentRefresh]);

  // --- 4. Background Validation Loop ---
  useEffect(() => {
    // 1. Only run if the token is set (user is nominally logged in)
    if (!isTokenSet) return;

    const validateSessionOnce = async () => {
      console.log('🔄 Running one-time session validation on load...');
      const isValid = await attemptSilentRefresh();

      if (!isValid) {
        console.warn('⛔ Session expired on load. Kicking user out.');
        await logout();
      }
    };

    // 2. Execute immediately
    validateSessionOnce();

    // 3. No cleanup function returned because there is no interval to clear
  }, [isTokenSet, attemptSilentRefresh, logout]);
  // --- 5. Fetch User Profile ---
  const {
    data: user,
    isFetching: isFetchingUser,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => await http.get<UserT>(AUTH_ENDPOINTS.GET_ME),
    enabled: isTokenSet, // Only fetch if we have tokens
    retry: false, // If /me fails, don't retry endlessly, just fail
    select: (data) => data.data,
  });

  // If fetching /me fails (e.g., 401), we should also logout
  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  // --- 6. Derived State & Context Value ---
  const isSignedIn = !!user;

  const value: AuthContextT = {
    user: user || null,
    isSignedIn,
    refresh: refetch,
    isLoading: isInitializing || isFetchingUser,
  } satisfies AuthContextT;

  if (isInitializing || isFetchingUser) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
