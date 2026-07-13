import { useAuthStore } from '@stores/auth.store';
import { useLocalAuthStore } from '@stores/local-auth.store';
import { useCallback, useEffect } from 'react';
import { Forbidden } from '@components/screens/forbidden';
import { View, StyleSheet } from 'react-native';
import { isRealDevice } from '@utils/helpers/expo';

export const LocalAuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useLocalAuthStore((s) => s.isAuthenticated);
  const isSupported = useLocalAuthStore((s) => s.isSupported);
  const isEnabled = useLocalAuthStore((s) => s.isEnabled);
  const authenticate = useLocalAuthStore((s) => s.authenticate);
  const { user } = useAuthStore();

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
      {isEnabled && !isRealDevice() && user && !isAuthenticated && (
        <View style={StyleSheet.absoluteFill} className="bg-white dark:bg-slate-950">
          <Forbidden onPressTryAgain={() => handleTryAgain()} />
        </View>
      )}
    </View>
  );
};
