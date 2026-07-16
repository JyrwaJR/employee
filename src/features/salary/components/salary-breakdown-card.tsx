import React from 'react';
import { View } from 'react-native';
import { Card } from '@components/ui/card';
import { Text } from '@components/ui/text';

/** A single salary breakdown line item with name and amount. */
export interface SalaryItem {
  pname: string;
  amount: string;
}

/** Props for the SalaryBreakdownCard component. */
interface SalaryBreakdownCardProps {
  /** Array of salary line items to display. */
  items: SalaryItem[];
}

/**
 * Renders the Salary Breakdown card.
 * Maps over the list of salary items and displays each as a label-value row
 * with a bottom border separator between items.
 */
export const SalaryBreakdownCard = ({ items }: SalaryBreakdownCardProps) => (
  <Card variant="bordered" className="p-5">
    <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
      Salary Breakdown
    </Text>
    {items.map((item, index) => (
      <View
        key={index}
        className="flex-row justify-between py-2"
        style={{
          borderBottomWidth: index < items.length - 1 ? 1 : 0,
          borderColor: '#E5E7EB',
        }}>
        <Text className="text-sm text-charcoal">{item.pname}</Text>
        <Text className="text-sm font-semibold text-foreground">{item.amount}</Text>
      </View>
    ))}
  </Card>
);
