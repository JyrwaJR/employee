import React from 'react';
import { View } from 'react-native';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/** Props for the TotalsCard component. */
interface TotalsCardProps {
  /** Total emolument amount. */
  totalEmolument: number;
  /** Total pay items amount. */
  totalPayItem: number;
  /** Net amount (NG). */
  totalng: number;
  /** Net pay amount (optional — only shown when present). */
  netPay?: number;
}

/**
 * Renders the Totals card at the bottom of the salary statement.
 * Displays total emolument, total pay items, net amount (NG),
 * and optionally net pay with a top border separator.
 */
export const TotalsCard = ({ totalEmolument, totalPayItem, totalng, netPay }: TotalsCardProps) => (
  <Card variant="bordered" className="p-5">
    <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">Totals</Text>
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm text-graphite">Total Emolument</Text>
      <Text className="text-sm font-bold text-foreground">{totalEmolument}</Text>
    </View>
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm text-graphite">Total Pay Items</Text>
      <Text className="text-sm font-bold text-foreground">{totalPayItem}</Text>
    </View>
    <View className="flex-row justify-between">
      <Text className="text-sm text-graphite">Net Amount (NG)</Text>
      <Text className="text-sm font-bold text-semantic-up">{totalng}</Text>
    </View>
    {netPay ? (
      <View className="mt-2 flex-row justify-between border-t border-border pt-2">
        <Text className="text-sm font-bold text-foreground">Net Pay</Text>
        <Text className="text-sm font-bold text-foreground">{netPay}</Text>
      </View>
    ) : null}
  </Card>
);
