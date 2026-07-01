import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaveBal } from '@sharedTypes/leave';
import { LeaveTypeCode } from '../types';
import { LEAVE_ICONS } from '../utils/constants';

interface LeaveBalanceCardProps {
  item: LeaveBal;
}

export const LeaveBalanceCard = ({ item }: LeaveBalanceCardProps) => (
  <View className="mt-4">
    <Text variant="heading" size="lg" className="mb-3 text-gray-900 dark:text-white">
      Leave Balance
    </Text>
    <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-3">
          <View className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/30">
            <MaterialCommunityIcons
              name={LEAVE_ICONS[item?.type as LeaveTypeCode] ?? 'calendar-blank'}
              size={20}
              color="#3B82F6"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900 dark:text-white">
              {item.leave_desc}
            </Text>
            <Text variant="subtext" size="xs">
              Closing as of {item.closing_bal_as_on}
            </Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{item.closing_bal}</Text>
      </View>
    </View>
  </View>
);
