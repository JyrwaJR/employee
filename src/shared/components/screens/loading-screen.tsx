import { cn } from '@utils/helpers/cn';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container } from '../layout/container';
import { Text } from '../ui/text';
import { useTheme } from '@hooks/use-theme';

// --- Types ---
interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Container className={cn('flex-1 items-center justify-center')}>
      <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#111827'} />

      <Text className={cn('mt-3 text-sm font-medium')}>{message}</Text>
    </Container>
  );
};
