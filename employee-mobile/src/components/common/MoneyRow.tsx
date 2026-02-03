import React from 'react';
import { View } from 'react-native';
import { cn } from '@/src/libs/cn';
import { Text } from '../ui/text';

type MoneyRowProps = {
  label: string;
  value: number;
  isBold?: boolean;
  isDeduction?: boolean;
};

export const MoneyRow = ({ label, value, isBold = false, isDeduction = false }: MoneyRowProps) => (
  <View
    className={cn(
      'flex-row justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-800',
      isBold && 'border-t border-gray-200 pt-4 dark:border-gray-700'
    )}>
    <Text
      className={cn(
        'text-sm',
        isBold
          ? 'font-bold text-gray-900 dark:text-white'
          : 'font-medium text-gray-600 dark:text-gray-300'
      )}>
      {label}
    </Text>
    <Text
      className={cn(
        'text-sm font-medium tabular-nums',
        isBold
          ? 'text-base font-bold text-gray-900 dark:text-white'
          : 'text-gray-900 dark:text-white',
        isDeduction && !isBold && 'text-red-500'
      )}>
      {isDeduction && !isBold ? '-' : ''}₹
      {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </Text>
  </View>
);
