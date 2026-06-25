import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@hooks/use-theme';
import { cn } from '@utils/helpers/cn';
import { Container } from '../layout/container';
import { Text } from '../ui/text';

interface EmptyScreenProps {
  title: string;
  refresh: () => void;
  message?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  refreshLabel?: string;
}

export const EmptyScreen = ({
  title,
  refresh,
  message,
  icon = 'inbox-outline',
  refreshLabel = 'Refresh',
}: EmptyScreenProps) => {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Container className={cn('flex-1 items-center justify-center px-6')}>
      <View
        className={cn(
          'mb-6 h-24 w-24 items-center justify-center rounded-full',
          'bg-gray-100 dark:bg-gray-800'
        )}>
        <MaterialCommunityIcons name={icon} size={48} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
      </View>

      <Text variant="heading" className={cn('mb-2 text-center text-gray-900 dark:text-white')}>
        {title}
      </Text>

      {message && (
        <Text variant="subtext" className={cn('mb-8 text-center text-base leading-6')}>
          {message}
        </Text>
      )}

      {!message && <View className={cn('mb-8')} />}

      <TouchableOpacity
        onPress={refresh}
        activeOpacity={0.8}
        className={cn('rounded-full bg-gray-900 px-8 py-3 dark:bg-white')}>
        <Text className={cn('font-semibold text-white dark:text-gray-900')}>{refreshLabel}</Text>
      </TouchableOpacity>
    </Container>
  );
};

EmptyScreen.displayName = 'EmptyScreen';
