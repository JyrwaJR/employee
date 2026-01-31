import React, { useEffect } from 'react';
import { ProviderWrapper } from '../components/provider';
import './global.css';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import { Stack } from 'expo-router';
import { SSL_CONFIG } from '../libs/config/networkConfig';

export default function Layout() {
  useEffect(() => {
    initializeSslPinning(SSL_CONFIG);
  }, []);

  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
