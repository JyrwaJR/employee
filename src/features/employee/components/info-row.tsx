import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';

export const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <View className="flex-row items-center border-b border-gray-100 py-3 last:border-0 dark:border-gray-800">
    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
      <Text className="text-sm">{icon}</Text>
    </View>
    <View>
      <Text variant="subtext" className="text-xs font-medium uppercase">
        {label}
      </Text>
      <Text className="text-sm font-semibold text-gray-900 dark:text-white">{value}</Text>
    </View>
  </View>
);
