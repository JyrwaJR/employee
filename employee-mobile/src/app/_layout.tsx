import React, { useEffect, useState } from 'react';
import { ProviderWrapper } from '@/src/shared/providers/ProviderWrapper';
import './global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { logger } from '../shared/utils/logger';

// Handle initial route settings
export const unstable_settings = {
  initialRouteName: '/auth',
};

// Prevent the splash screen from auto-hiding immediately.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

// Configure splash screen animation
SplashScreen.setOptions({
  duration: 100,
  fade: true,
});

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Any async initialization (fonts, auth checks) should happen here.
    // For now, we signal readiness immediately on mount.
    setAppIsReady(true);
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the initial render has happened.
      // A small delay (e.g., 300ms) ensures the UI has painted properly.
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          logger.warn('Failed to hide splash screen:', e);
        }
      };

      const timer = setTimeout(hideSplash, 500);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
