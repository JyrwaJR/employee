import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { EmployeeTaxSummary } from '../types';

export function TaxSummaryCard({
  item,
  onPress,
}: {
  item: EmployeeTaxSummary;
  onPress: () => void;
}) {
  const maskedPan =
    item.panNumber?.length >= 10 ? 'XXXX' + item.panNumber.slice(-4) : item.panNumber || '-';

  const statusColors: Record<string, string> = {
    NOT_FILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    FILED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    PROCESSED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const statusLabels: Record<string, string> = {
    NOT_FILED: 'Not Filed',
    FILED: 'Filed',
    PROCESSED: 'Processed',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {item.employeeName}
          </Text>
          <Text className="text-xs text-gray-500">{item.designation}</Text>
        </View>
        <View className={'rounded-full px-3 py-1 ' + (statusColors[item.filingStatus] || '')}>
          <Text className="text-xs font-semibold">
            {statusLabels[item.filingStatus] || item.filingStatus}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs font-medium uppercase text-gray-400">PAN</Text>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{maskedPan}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-medium uppercase text-gray-400">Gross Income</Text>
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            Rs {item.grossAnnualIncome.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
      <View className="mt-2 flex-row justify-between">
        <View className="flex-row items-center gap-1">
          <View
            className={
              'h-2 w-2 rounded-full ' + (item.regime === 'NEW' ? 'bg-blue-500' : 'bg-amber-500')
            }
          />
          <Text className="text-xs text-gray-500">
            {item.regime === 'NEW' ? 'New Regime' : 'Old Regime'}
          </Text>
        </View>
        <Text className="text-sm font-bold text-red-600 dark:text-red-400">
          Tax: Rs {item.totalTax.toLocaleString('en-IN')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
