import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';

export const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Text variant="heading" className="mb-4 text-sm text-gray-900 dark:text-white">
      {title}
    </Text>
    {children}
  </View>
);
