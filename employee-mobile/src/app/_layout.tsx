import React from 'react';
import { ProviderWrapper } from '../components/provider';
import './global.css';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import { Stack } from 'expo-router';

export default function Layout() {
  initializeSslPinning({
    'employee-nic.vercel.app': {
      includeSubdomains: true,
      publicKeyHashes: [
        'hS5jJ4P+iS6icS6iS6icS6iS6icS6iS6icS6iS6icS6=', // Leaf hash
        'C5+lpZ7tc+LRfQ1S3s1S3s1S3s1S3s1S3s1S3s1S3s1=', // Let's Encrypt R10 (Backup)
      ],
    },
  });

  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
