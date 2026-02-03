import { useAuth } from '@/src/hooks/auth/useAuth';
import { useLocalAuth } from '@/src/hooks/auth/useLocalAuth';
import { useLocalAuthStore } from '@/src/store/auth/useLocalAuthStore';
import { useCallback, useEffect } from 'react';
import { Forbidden } from './Forbidden';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';


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
