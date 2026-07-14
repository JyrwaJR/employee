import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';

/** A two-column table row (Label | Value) styled like the NIC e-HRMS portal. */
export const ProfileDetailRow = ({ label, value }: { label: string; value?: string | null }) => (
  <View className="flex-row border-b border-border">
    <View className="w-2/5 border-r border-border bg-surface-soft px-3 py-3">
      <Text variant="subtext" size="xs" className="font-medium text-graphite">
        {label}
      </Text>
    </View>
    <View className="flex-1 px-3 py-3">
      <Text className="text-sm font-semibold text-foreground">{value || '-'}</Text>
    </View>
  </View>
);
