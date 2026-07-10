import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';

interface GovtHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const GovtHeader = ({ title, subtitle, badge, className }: GovtHeaderProps) => (
  <View className={cn('mb-8 items-center gap-y-2', className)}>
    <View className="mb-3 h-[70px] w-[70px] items-center justify-center opacity-80">
      <Text className="text-7xl">🏛️</Text>
    </View>
    <Text variant={'subtext'} className="text-center text-[11px]">
      Government of India
    </Text>
    <Text variant={'heading'} className="text-center">
      {title}
    </Text>
    {subtitle && (
      <Text variant={'subtext'} className="text-center">
        {subtitle}
      </Text>
    )}
    {badge && (
      <View className="mt-4 rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-800">
        <Text className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">
          {badge}
        </Text>
      </View>
    )}
  </View>
);
