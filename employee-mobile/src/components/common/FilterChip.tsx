import { cn } from '@/src/libs/cn';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export const FilterChip = ({ label, active, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mr-2 rounded-full border px-4 py-2',
      active ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'
    )}>
    <Text className={cn('text-sm font-medium', active ? 'text-white' : 'text-gray-600')}>
      {label}
    </Text>
  </TouchableOpacity>
);
