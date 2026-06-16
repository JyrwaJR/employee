import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';

export const AuthDivider = () => (
  <View className="my-6 flex-row items-center gap-x-4">
    <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
    <Text variant="subtext" weight="medium">
      Or
    </Text>
    <View className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
  </View>
);
