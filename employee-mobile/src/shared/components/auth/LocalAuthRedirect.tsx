import { useAuth } from '@/src/shared/hooks/useAuth';
import { useLocalAuth } from '@/src/shared/hooks/useLocalAuth';
import { useLocalAuthStore } from '@/src/features/auth/store/useLocalAuthStore';
import { useCallback, useEffect } from 'react';
import { Forbidden } from '../screens/Forbidden';
import { isExpoGo } from '@/src/shared/constants';

export const LocalAuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { authenticate, isAuthenticated, isSupported } = useLocalAuth();
  const { isEnabled } = useLocalAuthStore();
  const { user } = useAuth();

  const handleSensitiveAction = useCallback(async () => {
    if (!user || !isEnabled) return;

    if (!isAuthenticated) {
      await authenticate();
    }
  }, [authenticate, isEnabled, user, isAuthenticated]);

  const handleTryAgain = async () => {
    await authenticate();
  };

  useEffect(() => {
    handleSensitiveAction();
  }, [isSupported, isEnabled, user]);

  if (isEnabled && !isExpoGo && user && !isAuthenticated) {
    return <Forbidden onPressTryAgain={() => handleTryAgain()} />;
  }

  return <>{children}</>;
};
