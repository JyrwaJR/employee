import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { Leave } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { cn } from '@utils/helpers/cn';

interface HomeLeavePreviewProps {
  leave: Leave;
}

const statusStyles: Record<string, string> = {
  Verified: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  Rejected: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  Pending: 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
};

export const HomeLeavePreview = ({ leave }: HomeLeavePreviewProps) => (
  <TouchableOpacity
    onPress={() => router.push(PAGE_ROUTES.LEAVE.DETAILS(leave.id))}
    activeOpacity={0.7}
    className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <View className="mb-1 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-2">
        <Text
          className="flex-1 text-sm font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}>
          {leave.leave_desc}
        </Text>
        <View
          className={cn(
            'rounded-full px-2 py-0.5',
            statusStyles[leave.verify_flg_desc] || statusStyles.Pending
          )}>
          <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={18} color="#9CA3AF" />
    </View>
    <Text variant="subtext" size="xs" className="mb-1">
      {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
    </Text>
    <Text variant="subtext" size="sm">
      {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
    </Text>
  </TouchableOpacity>
);
