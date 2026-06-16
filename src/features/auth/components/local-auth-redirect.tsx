import { useAuth } from '@/src/shared/hooks/use-auth';
import { useLocalAuth } from '@/src/shared/hooks/use-local-auth';
import { useLocalAuthStore } from '@/src/shared/stores/local-auth.store';
import { useCallback, useEffect } from 'react';
import { Forbidden } from '@/src/shared/components/screens/forbidden';
import { isExpoGo } from '@/src/shared/constants';
import { View, StyleSheet } from 'react-native';

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

  return (
    <View className="flex-1">
      {children}
      {isEnabled && !isExpoGo && user && !isAuthenticated && (
        <View style={StyleSheet.absoluteFill} className="bg-white dark:bg-slate-950">
          <Forbidden onPressTryAgain={() => handleTryAgain()} />
        </View>
      )}
    </View>
  );
};
