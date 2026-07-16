import React from 'react';
import { View } from 'react-native';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/** Props for the GPFInfoCard component. */
interface GPFInfoCardProps {
  /** General Provident Fund description. */
  gpfDesc: string;
  /** General Provident Fund number. */
  gpfNo: string;
}

/**
 * Renders the GPF (General Provident Fund) information card.
 * Displays the GPF description and GPF number from the salary statement.
 */
export const GPFInfoCard = ({ gpfDesc, gpfNo }: GPFInfoCardProps) => (
  <Card variant="bordered" className="p-5">
    <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
      GPF Information
    </Text>
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm text-graphite">Description</Text>
      <Text className="text-sm font-semibold text-foreground">{gpfDesc}</Text>
    </View>
    <View className="flex-row justify-between">
      <Text className="text-sm text-graphite">GPF Number</Text>
      <Text className="text-sm font-semibold text-foreground">{gpfNo}</Text>
    </View>
  </Card>
);
