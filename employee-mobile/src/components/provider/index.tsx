import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TQueryProvider } from '@components/provider/query';
import { Toaster } from 'sonner-native';
import { AuthContextProvider } from './auth';
import { AuthRedirect } from '../common/AuthRedirect';
import { StatusBar, View } from 'react-native';
import { SSLPinning } from './ssl';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../common/LoadingScreen';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider className="flex-1 bg-white">
        <SSLPinning>
          <TQueryProvider>
            <AuthContextProvider>
              <AuthRedirect>
                <StatusBar barStyle="dark-content" />
                <View className="flex-1">{children}</View>
                <Toaster />
              </AuthRedirect>
            </AuthContextProvider>
          </TQueryProvider>
        </SSLPinning>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
