import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';

/** A two-column table row (Label | Value) styled like the NIC e-HRMS portal. */
export const ProfileDetailRow = ({ label, value }: { label: string; value?: string | null }) => (
  <View className="flex-row border-b border-gray-200 dark:border-gray-800">
    <View className="w-2/5 border-r border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-900">
      <Text className="text-sm font-medium">{label}</Text>
    </View>

    <View className="flex-1 px-3 py-3">
      <Text className="text-sm">{value || '-'}</Text>
    </View>
  </View>
);
