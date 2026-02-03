import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SalarySlip } from '@/src/types/employee';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/src/libs/cn';
import { Text } from '@/src/components/ui/text';

export const HistoryCard = ({ item, onPress }: { item: SalarySlip; onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:active:bg-slate-800">
    <View className="mb-2 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#2563EB" />
        </View>
        <View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {item.month} {item.year}
          </Text>
          <Text variant="subtext" className="text-xs font-medium">
            Credited on{' '}
            {new Date(item.created_at).toLocaleString('default', {
              month: '2-digit',
              day: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
    </View>

    <View className="my-2 h-[1px] bg-gray-100 dark:bg-gray-800" />

    <View className="mt-1 flex-row items-center justify-between">
      <View>
        <Text className="mb-0.5 text-xs text-slate-500 dark:text-slate-400">Net Pay</Text>
        <Text className="text-lg font-bold text-slate-900 dark:text-white">
          ₹{item.total_earnings}
        </Text>
      </View>
      <View className="items-end">
        <View
          className={cn(
            'mb-1 flex-row items-center gap-1 rounded-full px-2 py-1',
            item.status === 'PAID'
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-orange-100 dark:bg-orange-900/30'
          )}>
          <MaterialCommunityIcons
            name={item.status === 'PAID' ? 'check-circle' : 'clock-outline'}
            size={12}
            color={item.status === 'PAID' ? '#166534' : '#C2410C'}
          />
          <Text
            className={cn(
              'text-xs font-medium',
              item.status === 'PAID'
                ? 'text-green-800 dark:text-green-400'
                : 'text-orange-800 dark:text-orange-400'
            )}>
            {item.status}
          </Text>
        </View>
        <Text className="text-[10px] text-slate-400">Salary Slip</Text>
      </View>
    </View>
  </TouchableOpacity>
);
