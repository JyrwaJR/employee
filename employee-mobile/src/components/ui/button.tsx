import { cn } from '@/src/libs/cn';
import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'google';
  isLoading?: boolean;
  className?: string;
}

export const ModernButton = ({
  onPress,
  className,
  title,
  variant = 'primary',
  isLoading,
}: ButtonProps) => {
  const isGoogle = variant === 'google';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.9}
      className={cn(
        'flex-row items-center justify-center rounded-2xl py-4 shadow-sm',
        isGoogle ? 'border border-gray-200 bg-white' : 'bg-gray-900',
        isLoading && 'opacity-70',
        className
      )}>
      {isLoading ? (
        <ActivityIndicator color={isGoogle ? '#000' : '#FFF'} />
      ) : (
        <>
          {isGoogle && (
            // Replace this Text with an <SVG /> or <Image /> of the Google Logo
            <Text className="mr-3 text-lg font-bold text-red-500">G</Text>
          )}
          <Text
            className={cn('text-base font-semibold', isGoogle ? 'text-gray-700' : 'text-white')}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
