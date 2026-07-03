import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { Leave } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { cn } from '@utils/helpers/cn';
import { getStatusColor } from '@utils/helpers';

interface HomeLeavePreviewProps {
  leave: Leave;
}

export const HomeLeavePreview = ({ leave }: HomeLeavePreviewProps) => {
  const onPressLeave = () => {
    const { leave_cd, from_dt1, order_dt1 } = leave;
    const pageUrl = PAGE_ROUTES.LEAVE.DETAILS({
      leave_cd,
      from_dt: from_dt1,
      order_dt: order_dt1,
    });
    router.push(pageUrl);
  };
  return (
    <TouchableOpacity
      onPress={onPressLeave}
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
            className={cn('rounded-full px-2 py-0.5', getStatusColor(leave.verify_flg_desc).bg)}>
            <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={18} color="#9CA3AF" />
      </View>
      <Text variant="subtext" size="xs" className="mb-1">
        {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
      </Text>
      <Text variant="subtext" size="sm">
        {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
      </Text>
    </TouchableOpacity>
  );
};
