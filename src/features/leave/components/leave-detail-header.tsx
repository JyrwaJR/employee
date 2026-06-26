import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { getStatusColor } from '@utils/helpers/get-status-color';
import { Leave } from '@sharedTypes/leave';

interface LeaveDetailHeaderProps {
  leave: Leave;
}

export const LeaveDetailHeader = ({ leave }: LeaveDetailHeaderProps) => {
  const statusStyle = getStatusColor(leave.verify_flg_desc);

  return (
    <View className="mt-4">
      <View className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="rounded-2xl bg-purple-100 p-3 dark:bg-purple-900/30">
            <MaterialCommunityIcons name="calendar-account" size={32} color="#7C3AED" />
          </View>
          <View
            className={cn(
              'flex-row items-center gap-1.5 rounded-full px-3 py-1.5',
              statusStyle.bg
            )}>
            <MaterialCommunityIcons
              name={statusStyle.iconName}
              size={14}
              color={statusStyle.icon}
            />
            <Text className={cn('text-xs font-semibold', statusStyle.text)}>
              {leave.verify_flg_desc}
            </Text>
          </View>
        </View>

        <Text variant="heading" size="2xl" className="mb-1 text-gray-900 dark:text-white">
          {leave.leave_desc}
        </Text>
        <Text variant="subtext" size="sm">
          {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </View>
  );
};
