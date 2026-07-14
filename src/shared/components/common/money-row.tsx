import React from 'react';
import { View } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { Text } from '../ui/text';

type MoneyRowProps = {
  label: string;
  value: number;
  isBold?: boolean;
  isDeduction?: boolean;
};

/**
 * Displays a monetary label-value row with Indian Rupee formatting.
 * Supports bold emphasis for total rows and red styling for deduction rows.
 */
export const MoneyRow = ({ label, value, isBold = false, isDeduction = false }: MoneyRowProps) => (
  <View
    className={cn(
      'flex-row justify-between border-b border-border py-3 last:border-0',
      isBold && 'border-t border-border pt-4'
    )}>
    <Text
      className={cn('text-sm', isBold ? 'font-bold text-foreground' : 'font-medium text-charcoal')}>
      {label}
    </Text>
    <Text
      className={cn(
        'text-sm font-medium tabular-nums',
        isBold ? 'text-base font-bold text-foreground' : 'text-foreground',
        isDeduction && !isBold && 'text-red-500'
      )}>
      {isDeduction && !isBold ? '-' : ''}₹
      {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </Text>
  </View>
);
