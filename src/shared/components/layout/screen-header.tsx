import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@/src/shared/utils/cn';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ScreenHeader = ({
  title,
  subtitle,
  rightElement,
  children,
  className,
}: ScreenHeaderProps) => (
  <View
    className={cn(
      'z-10 rounded-b-[32px] border-b border-gray-100 bg-white px-6 pb-6 pt-4 shadow-sm dark:border-gray-800 dark:bg-gray-900',
      className
    )}>
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-1">
        {subtitle && (
          <Text variant="subtext" className="text-sm font-medium">
            {subtitle}
          </Text>
        )}
        <Text variant="heading" size="2xl" className="text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
      {rightElement}
    </View>
    {children}
  </View>
);
