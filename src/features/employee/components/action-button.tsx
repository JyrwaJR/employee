import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { cn } from '@utils/helpers/cn';

export const ActionButton = ({
  label,
  icon,
  onPress,
  primary,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  primary?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mx-1 flex-1 flex-row items-center justify-center rounded-xl py-3',
      primary ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
    )}>
    <Text className="mr-2">{icon}</Text>
    <Text
      className={cn('font-semibold', primary ? 'text-white' : 'text-gray-900 dark:text-gray-200')}>
      {label}
    </Text>
  </TouchableOpacity>
);
