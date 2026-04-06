import { useAuth } from '@/src/shared/hooks/useAuth';
import { useLocalAuth } from '@/src/shared/hooks/useLocalAuth';
import { useLocalAuthStore } from '@/src/shared/store/local-auth.store';
import { useCallback, useEffect } from 'react';
import { Forbidden } from '../screens/Forbidden';
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
    <View style={styles.container}>
      {children}
      {isEnabled && !isExpoGo && user && !isAuthenticated && (
        <View style={StyleSheet.absoluteFill} className="bg-white dark:bg-slate-950">
          <Forbidden onPressTryAgain={() => handleTryAgain()} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
