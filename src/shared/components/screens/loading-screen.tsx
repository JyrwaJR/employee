import { cn } from '@utils/helpers/cn';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
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
      <View className="mb-10 items-center justify-center">
        <View className={cn('h-20 w-20 items-center justify-center rounded-3xl shadow-sm')}>
          <Text className="text-4xl">✨</Text>
        </View>
      </View>

      <ActivityIndicator size="small" color={isDarkMode ? '#ffffff' : '#111827'} />

      <Text className={cn('mt-3 text-sm font-medium')}>{message}</Text>
    </Container>
  );
};
