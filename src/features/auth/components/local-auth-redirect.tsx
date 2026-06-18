import { useAuth } from '@hooks/use-auth';
import { useLocalAuth } from '@hooks/use-local-auth';
import { useLocalAuthStore } from '@stores/local-auth.store';
import { useCallback, useEffect } from 'react';
import { Forbidden } from '@components/screens/forbidden';
import { isExpoGo } from '@utils/constants';
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
