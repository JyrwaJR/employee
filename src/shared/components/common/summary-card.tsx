import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';
import { useAuthStore } from '@stores/auth.store';
import { getStatusColor } from '@utils/helpers';
import { SalaryStatementStatus } from '@sharedTypes/satatement';

interface SummaryCardProps {
  label: string;
  amount: string;
  className?: string;
  status?: SalaryStatementStatus;
}

export const SummaryCard = ({ label, amount, className, status = 'PENDING' }: SummaryCardProps) => {
  const { user } = useAuthStore();
  const statusStyle = getStatusColor(status);
  const bgClass = statusStyle.bg;

  const textClass = statusStyle.text;

  const borderClass = statusStyle.border;

  return (
    <View className={cn('mb-6 rounded-lg p-6', bgClass, className)}>
      <Text className={cn('mb-1 text-sm font-medium', textClass)}>{label}</Text>
      <Text className="mb-6 text-4xl font-bold text-white">{amount}</Text>

      <View className={cn('mb-4 h-[1px] w-full', borderClass)} />

      <View className="flex-row justify-between">
        <View>
          <Text className={cn('mb-1 text-xs', textClass)}>Pay Level</Text>
          <Text className="font-semibold text-white">{user?.pay_scale ?? '-'}</Text>
        </View>
        <View>
          <Text className={cn('mb-1 text-xs', textClass)}>Bank Account No.</Text>
          <Text className="font-semibold text-white">
            ********{user?.emp_bank_account_no?.slice(4) ?? '-'}
          </Text>
        </View>
      </View>
    </View>
  );
};
