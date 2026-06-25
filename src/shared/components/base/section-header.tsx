import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: 'section' | 'splash';
}

export const SectionHeader = ({
  title,
  icon,
  subtitle,
  rightElement,
  children,
  className,
  variant = 'section',
}: SectionHeaderProps) => {
  if (variant === 'splash') {
    return (
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
  }

  return (
    <View className={cn('mb-4 flex-row items-center', className)}>
      {icon && (
        <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
          <Text className="text-xs text-blue-600 dark:text-blue-400">{icon}</Text>
        </View>
      )}
      <Text variant="heading" size="lg" className="text-gray-900 dark:text-white">
        {title}
      </Text>
    </View>
  );
};
