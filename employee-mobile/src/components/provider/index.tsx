import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TQueryProvider } from '@components/provider/query';
import { Toaster } from 'sonner-native';
import { AuthContextProvider } from './auth';
import { LocalAuthProvider } from './auth/LocalAuthProvider';
import { AuthRedirect } from '../common/AuthRedirect';
import { StatusBar, View } from 'react-native';
import { SSLPinning } from './ssl';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../common/LoadingScreen';
import { ThemeProvider } from './theme';
import { LocalAuthRedirect } from '../common/LocalAuthRedirect';
import { NotificationProvider } from './notification';

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
