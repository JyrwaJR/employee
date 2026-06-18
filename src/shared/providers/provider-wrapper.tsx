import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

// Internal Providers
import { AuthContextProvider } from './auth-provider';
import { LocalAuthProvider } from './local-auth-provider';
import { NotificationProvider } from './notification-provider';
import { TQueryProvider } from './query-provider';
import { SSLPinning } from './ssl-pinning-provider';
import { ThemeProvider } from './theme-provider';
import { UpdatesProvider } from './updates-provider';

// Shared Components & Redirects
import { AuthRedirect } from '@features/auth/components/auth-redirect';
import { LocalAuthRedirect } from '@features/auth/components/local-auth-redirect';
import { UpdateModal } from '@components/display/update-modal';
import { GlobalErrorBoundary } from '@components/feedback/global-error-boundary';

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
