import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TQueryProvider } from './QueryProvider';
import { Toaster } from 'sonner-native';
import { AuthContextProvider } from '@features/auth/providers/AuthProvider';
import { LocalAuthProvider } from '@features/auth/providers/LocalAuthProvider';
import { AuthRedirect } from '@shared/components/auth/AuthRedirect';
import { StatusBar } from 'expo-status-bar';
import { SSLPinning } from './SSLPinningProvider';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LocalAuthRedirect } from '@shared/components/auth/LocalAuthRedirect';
import { PushNotificationProvider } from '@/src/features/pushNotification/providers/PushNotificationProvider';

import { UpdatesProvider } from './UpdatesProvider';
import { UpdateModal } from '@shared/components/display/UpdateModal';
import { GlobalErrorBoundary } from '@shared/components/feedback/GlobalErrorBoundary';

type Props = {
  children: React.ReactNode;
};

export const ProviderWrapper = ({ children }: Props) => {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <UpdatesProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="auto" animated translucent />
            <Toaster />
            <SafeAreaProvider className="flex-1">
              <SSLPinning>
                <TQueryProvider>
                  <AuthContextProvider>
                    <PushNotificationProvider>
                      <LocalAuthProvider>
                        <LocalAuthRedirect>
                          <AuthRedirect>
                            {children}
                            <UpdateModal />
                          </AuthRedirect>
                        </LocalAuthRedirect>
                      </LocalAuthProvider>
                    </PushNotificationProvider>
                  </AuthContextProvider>
                </TQueryProvider>
              </SSLPinning>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </UpdatesProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
};
