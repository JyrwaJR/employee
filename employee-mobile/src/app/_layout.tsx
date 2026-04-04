import React from 'react';
import { ProviderWrapper } from '@/src/shared/providers/ProviderWrapper';
import './global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

export const unstable_settings = {
  initialRouteName: '/auth',
};

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function Layout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
