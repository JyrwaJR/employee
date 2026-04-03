import React from 'react';
import { ProviderWrapper } from '@/src/shared/providers/ProviderWrapper';
import './global.css';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
