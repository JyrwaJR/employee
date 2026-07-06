import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Icon } from '@components/ui';
import { cn } from '@utils/helpers/cn';

interface GovtHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const GovtHeader = ({ title, subtitle, badge, className }: GovtHeaderProps) => (
  <View className={cn('mb-8 items-center', className)}>
    <View className="mb-3 h-16 w-16 items-center justify-center opacity-80">
      <Icon name="bank" size={48} />
    </View>
    <Text className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
      Government of India
    </Text>
    <Text variant="heading" size="lg" className="text-center text-gray-900 dark:text-white">
      {title}
    </Text>
    {subtitle && (
      <Text variant="subtext" className="text-center text-sm">
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
