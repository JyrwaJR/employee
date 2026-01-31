import React, { useEffect } from 'react';
import { ProviderWrapper } from '../components/provider';
import './global.css';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
