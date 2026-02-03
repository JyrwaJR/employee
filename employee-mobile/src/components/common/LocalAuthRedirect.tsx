import { useLocalAuth } from '@/src/hooks/auth/useLocalAuth';
import { useLocalAuthStore } from '@/src/store/auth/useLocalAuthStore';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

export const LocalAuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { authenticate, isAuthenticated, isSupported } = useLocalAuth();
  const { isEnabled } = useLocalAuthStore();
  const router = useRouter();

  const handleSensitiveAction = useCallback(async () => {
    if (!isEnabled) return;

    const success = await authenticate();

    if (success) {
      router.replace('/');
    } else {
      router.replace('/forbidden');
    }
  }, [authenticate, router, isEnabled]);

  useEffect(() => {
    if (isEnabled && !isAuthenticated) {
      router.replace('/forbidden');
    }
  }, [isEnabled, isAuthenticated, router]);

  useEffect(() => {
    handleSensitiveAction();
  }, [isSupported, isEnabled]);

  return <>{children}</>;
};
