import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';

export const ProfileDetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <View className="flex-row justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
    <Text variant="subtext" className="w-1/3 text-sm font-medium">
      {label}
    </Text>
    <Text className="flex-1 text-right text-sm font-medium text-gray-900 dark:text-white">
      {value || '-'}
    </Text>
  </View>
);
