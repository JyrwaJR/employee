import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';

interface SummaryCardProps {
  label: string;
  amount: string;
  details: {
    label: string;
    value: string;
  }[];
  className?: string;
  variant?: 'blue' | 'green' | 'red';
}

export const SummaryCard = ({
  label,
  amount,
  details,
  className,
  variant = 'blue',
}: SummaryCardProps) => {
  const bgClass =
    variant === 'green'
      ? 'bg-green-600 dark:bg-green-700'
      : variant === 'red'
        ? 'bg-red-600 dark:bg-red-700'
        : 'bg-blue-600 dark:bg-blue-700';

  const textClass =
    variant === 'green' ? 'text-green-100' : variant === 'red' ? 'text-red-100' : 'text-blue-100';

  const borderClass =
    variant === 'green'
      ? 'bg-green-500/50'
      : variant === 'red'
        ? 'bg-red-500/50'
        : 'bg-blue-500/50';

  return (
    <View className={cn('mb-6 rounded-3xl p-6 shadow-xl shadow-blue-900/20', bgClass, className)}>
      <Text className={cn('mb-1 text-sm font-medium', textClass)}>{label}</Text>
      <Text className="mb-6 text-4xl font-bold text-white">{amount}</Text>

      <View className={cn('mb-4 h-[1px] w-full', borderClass)} />

      <View className="flex-row justify-between">
        {details.map((detail, index) => (
          <View key={index}>
            <Text className={cn('mb-1 text-xs', textClass)}>{detail.label}</Text>
            <Text className="font-semibold text-white">{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
