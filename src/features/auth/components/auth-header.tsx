import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';
import { cn } from '@/src/shared/utils/helpers/cn';

interface AuthHeaderProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  subtitle: string;
  containerClassName?: string;
  iconContainerClassName?: string;
}

export const AuthHeader = ({
  icon,
  emoji,
  title,
  subtitle,
  containerClassName,
  iconContainerClassName,
}: AuthHeaderProps) => (
  <View className={cn('mb-10 items-center', containerClassName)}>
    <View
      className={cn(
        'mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30',
        iconContainerClassName
      )}>
      {icon ? icon : emoji ? <Text className="text-3xl">{emoji}</Text> : null}
    </View>
    <Text variant="heading" size="3xl" weight="semibold" className="text-center">
      {title}
    </Text>
    <Text variant="subtext" className="mt-2 text-center">
      {subtitle}
    </Text>
  </View>
);
