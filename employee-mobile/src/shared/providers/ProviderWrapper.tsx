import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

// Internal Providers
import { AuthContextProvider } from './AuthProvider';
import { LocalAuthProvider } from './LocalAuthProvider';
import { NotificationProvider } from './NotificationProvider';
import { TQueryProvider } from './QueryProvider';
import { SSLPinning } from './SSLPinningProvider';
import { ThemeProvider } from './ThemeProvider';
import { UpdatesProvider } from './UpdatesProvider';

// Shared Components & Redirects
import { AuthRedirect } from '@shared/components/auth/AuthRedirect';
import { LocalAuthRedirect } from '@shared/components/auth/LocalAuthRedirect';
import { UpdateModal } from '@shared/components/display/UpdateModal';
import { GlobalErrorBoundary } from '@shared/components/feedback/GlobalErrorBoundary';

type Props = {
  children: React.ReactNode;
};

/**
 * Global Provider Wrapper
 *
 * Consolidates all application-wide providers into a single optimized tree.
 * Hierarchy follows a dependency-first approach:
 * 1. Low-level Infrastructure (Gestures, SafeArea, SSL, Updates)
 * 2. Data & State Management (Query, Theme)
 * 3. Domain Contexts (Auth, Notifications)
 * 4. Navigation & Security Gates (LocalAuth, AuthRedirect)
 */
export const ProviderWrapper = ({ children }: Props) => {
  return (
    <GlobalErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider className="flex-1">
          <SSLPinning>
            <UpdatesProvider>
              <TQueryProvider>
                <QueryErrorResetBoundary>
                  <ThemeProvider>
                    <AuthContextProvider>
                      <NotificationProvider>
                        <LocalAuthProvider>
                          <LocalAuthRedirect>
                            <AuthRedirect>
                              <StatusBar style="auto" animated translucent />
                              {children}
                              <UpdateModal />
                            </AuthRedirect>
                          </LocalAuthRedirect>
                        </LocalAuthProvider>
                      </NotificationProvider>
                    </AuthContextProvider>
                  </ThemeProvider>
                </QueryErrorResetBoundary>
              </TQueryProvider>
            </UpdatesProvider>
          </SSLPinning>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalErrorBoundary>
  );
};
