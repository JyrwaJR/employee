import { TQueryProvider } from './QueryProvider';
import { AuthContextProvider } from './AuthProvider';
import { LocalAuthProvider } from './LocalAuthProvider';
import { AuthRedirect } from '@shared/components/auth/AuthRedirect';
import { StatusBar } from 'expo-status-bar';
import { SSLPinning } from './SSLPinningProvider';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LocalAuthRedirect } from '@shared/components/auth/LocalAuthRedirect';
import { PushNotificationProvider } from '@/src/features/pushNotification/providers/PushNotificationProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UpdatesProvider } from './UpdatesProvider';
import { UpdateModal } from '@shared/components/display/UpdateModal';
import { GlobalErrorBoundary } from '@shared/components/feedback/GlobalErrorBoundary';

type Props = {
  children: React.ReactNode;
};

export const ProviderWrapper = ({ children }: Props) => {
  return (
    <GlobalErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider className="flex-1">
          <UpdatesProvider>
            <ThemeProvider>
              <SSLPinning>
                <TQueryProvider>
                  <AuthContextProvider>
                    <PushNotificationProvider>
                      <LocalAuthProvider>
                        <LocalAuthRedirect>
                          <AuthRedirect>
                            <StatusBar style="auto" animated translucent />
                            {children}
                            <UpdateModal />
                          </AuthRedirect>
                        </LocalAuthRedirect>
                      </LocalAuthProvider>
                    </PushNotificationProvider>
                  </AuthContextProvider>
                </TQueryProvider>
              </SSLPinning>
            </ThemeProvider>
          </UpdatesProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalErrorBoundary>
  );
};
