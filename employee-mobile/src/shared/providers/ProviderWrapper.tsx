import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TQueryProvider } from './QueryProvider';
import { Toaster } from 'sonner-native';
import { AuthContextProvider } from '@/src/features/auth/providers/AuthProvider';
import { LocalAuthProvider } from '@/src/features/auth/providers/LocalAuthProvider';
import { AuthRedirect } from '@/src/shared/components/auth/AuthRedirect';
import { StatusBar, View } from 'react-native';
import { SSLPinning } from './SSLPinningProvider';
import React, { useEffect } from 'react';
import { LoadingScreen } from '@/src/shared/components/screens/LoadingScreen';
import { ThemeProvider } from './ThemeProvider';
import { LocalAuthRedirect } from '@/src/shared/components/auth/LocalAuthRedirect';
import { NotificationProvider } from '@/src/features/notification/providers/NotificationProvider';

type Props = {
  children: React.ReactNode;
};

export const ProviderWrapper = ({ children }: Props) => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider className="flex-1">
          <SSLPinning>
            <TQueryProvider>
              <AuthContextProvider>
                <NotificationProvider>
                  <LocalAuthProvider>
                    <LocalAuthRedirect>
                      <AuthRedirect>
                        <StatusBar barStyle="default" />
                        <View className="flex-1">{children}</View>
                        <Toaster />
                      </AuthRedirect>
                    </LocalAuthRedirect>
                  </LocalAuthProvider>
                </NotificationProvider>
              </AuthContextProvider>
            </TQueryProvider>
          </SSLPinning>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
