import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { getStatusColor } from '@utils/helpers/get-status-color';
import { Leave } from '@sharedTypes/leave';

export const LeaveCard = ({ item, onPress }: { item: Leave; onPress?: () => void }) => {
  const statusStyle = getStatusColor(item.verify_flg_desc);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onPress}
      onPress={onPress}
      className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:active:bg-slate-800">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <MaterialCommunityIcons name="calendar-account" size={24} color="#7C3AED" />
          </View>
          <View>
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              {item.leave_desc}
            </Text>
            <Text variant="subtext" className="text-xs font-medium">
              Applied on{' '}
              {new Date(item.order_dt1).toLocaleString('default', {
                month: 'long',
                day: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <View className={cn('flex-row items-center gap-1 rounded-full px-2 py-1', statusStyle.bg)}>
          <MaterialCommunityIcons name={statusStyle.iconName} size={12} color={statusStyle.icon} />
          <Text className={cn('text-xs font-medium', statusStyle.text)}>
            {item.verify_flg_desc}
          </Text>
        </View>
      </View>

      <View className="my-2 h-[1px] bg-gray-100 dark:bg-gray-800" />

      <View className="mt-1 flex-row justify-between">
        <View className="flex-1">
          <Text className="mb-1 text-xs text-slate-500 dark:text-slate-400">Duration</Text>
          <View className="flex-row items-center">
            <Text className="font-semibold text-slate-900 dark:text-white">
              {new Date(item.from_dt1).toLocaleString('default', {
                month: 'long',
                day: '2-digit',
              })}
            </Text>
            <Text className="mx-2 text-slate-400">→</Text>
            <Text className="font-semibold text-slate-900 dark:text-white">
              {new Date(item.to_dt1).toLocaleString('default', {
                month: 'long',
                day: '2-digit',
              })}
            </Text>
          </View>
          <Text className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            {item.no_days} Days
          </Text>
        </View>
      </View>

      {item.reason_for_leave && (
        <View className="mt-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
          <Text numberOfLines={1} className="text-xs italic text-slate-600 dark:text-slate-400">
            {item.reason_for_leave}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
