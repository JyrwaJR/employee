import React, { useEffect } from 'react';
import { ProviderWrapper } from '@providers/provider-wrapper';
import { NetworkBanner } from '@components/network';
import { Toaster, SnackbarProvider } from '@components/ui';
import '../shared/styles/global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { logger } from '../shared/utils/logger';

// Handle initial route settings
export const unstable_settings = {
  initialRouteName: '/auth',
};

// Prevent the splash screen from auto-hiding before JS has mounted.
// This is intentionally module-level – must run before any component renders.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Non-critical; splash will hide via the timeout fallback in Layout */
});

// Configure the splash screen hide animation.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

/** Root layout that wraps every screen with global providers and UI shell. */
export default function Layout() {
  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      // --- Async startup work (fonts, auth token hydration, etc.) goes here ---

      // Brief delay lets React commit the first frame before we tear down
      // the native splash screen, preventing a white flash.
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (cancelled) return;

      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        logger.warn('Failed to hide splash screen:', e);
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProviderWrapper>
      <NetworkBanner />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      <Toaster />
      <SnackbarProvider />
    </ProviderWrapper>
  );
}
