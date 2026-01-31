import { cn } from '@/src/libs/cn';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

// --- Types ---
interface LoadingScreenProps {
  message?: string;
  variant?: 'light' | 'dark';
}


export const LoadingScreen = ({
  message = 'Loading...',
  variant = 'light',
}: LoadingScreenProps) => {
  const isDark = variant === 'dark';

  return (
    <View className={cn('flex-1 items-center justify-center', isDark ? 'bg-gray-950' : 'bg-white')}>
      <View className="mb-10 items-center justify-center">
        <View
          className={cn(
            'h-20 w-20 items-center justify-center rounded-3xl shadow-sm',
            isDark ? 'bg-gray-800' : 'border border-gray-100 bg-gray-50'
          )}>
          <Text className="text-4xl">✨</Text>
        </View>
      </View>

      <ActivityIndicator size="small" color={isDark ? '#ffffff' : '#111827'} />

      <Text className={cn('mt-3 text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-400')}>
        {message}
      </Text>

      <View className="absolute bottom-12">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
          Secure Environment
        </Text>
      </View>
    </View>
  );
};
