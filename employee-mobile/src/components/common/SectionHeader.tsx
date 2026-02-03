import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';

export const SectionHeader = ({ title, icon }: { title: string; icon?: string }) => (
  <View className="mb-4 flex-row items-center">
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
