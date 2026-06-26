import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@utils/helpers/cn';
import { Leave } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';

/** Props for {@link HomeActiveLeaveCard}. */
interface HomeActiveLeaveCardProps {
  /** Current active leave, or null if none. */
  leave: Leave | null;
}

/**
 * Card displaying the user's currently active leave request.
 * Shows a fallback "No upcoming leaves" message when `leave` is null.
 */
export const HomeActiveLeaveCard = ({ leave }: HomeActiveLeaveCardProps) => {
  if (!leave) {
    return (
      <Card>
        <CardContent className="p-5">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="calendar-check" size={22} color="#9CA3AF" />
            <Text variant="subtext" className="ml-3 text-sm font-medium">
              No upcoming leaves
            </Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  const statusColor =
    leave.verify_flg_desc === 'Verified'
      ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      : leave.verify_flg_desc === 'Rejected'
        ? 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
        : 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';

  return (
    <Card>
      <CardContent className="p-5">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="umbrella" size={22} color="#3B82F6" />
            <Text variant="heading" size="lg" className="ml-2 text-gray-900 dark:text-white">
              Active Leave
            </Text>
          </View>
          <View className={cn('rounded-full px-3 py-1', statusColor)}>
            <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {leave.leave_cd}
            </Text>
            <Text variant="subtext" size="sm">
              {formatDate(leave.from_dt)} — {formatDate(leave.to_dt)}
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};
