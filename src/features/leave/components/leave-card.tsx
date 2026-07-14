import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { getStatusColor } from '@utils/helpers/get-status-color';
import type { LeaveListItem, LeaveTypeCode } from '@sharedTypes/leave';
import { LEAVE_ICONS } from '../utils/constants';
import { useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { formatDate } from '@utils/formatters/formatters';
import { Icon } from '@components/ui/icon';
import { Card } from '@components/ui/card';

export const LeaveCard = ({ item }: { item: LeaveListItem; onPress?: () => void }) => {
  const router = useRouter();
  const statusStyle = getStatusColor(item.verify_flg_desc);
  const isEnable = !!item.leave_cd && !!item.from_dt && !!item.order_dt;

  const onPressLeave = () => {
    const { leave_cd, from_dt1, order_dt1 } = item;
    const pageUrl = PAGE_ROUTES.LEAVE.DETAILS({
      leave_cd,
      from_dt: from_dt1,
      order_dt: order_dt1,
    });
    router.push(pageUrl);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!isEnable}
      onPress={onPressLeave}
      className="mb-4 active:opacity-80">
      <Card variant="bordered" className="p-5">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className={cn('rounded-lg p-2', statusStyle.bg)}>
              <Icon
                name={(LEAVE_ICONS[item.leave_cd as LeaveTypeCode] as any) ?? 'calendar-account'}
                size={24}
                color={statusStyle.icon}
              />
            </View>
            <View>
              <Text variant="display-xs" className="text-foreground">
                {item.leave_desc}
              </Text>
              <Text variant="subtext" size="xs" className="font-medium">
                Applied on {formatDate(item.order_dt1)}
              </Text>
            </View>
          </View>
          <View
            className={cn('flex-row items-center gap-1 rounded-full px-3 py-1', statusStyle.bg)}>
            <Icon name={statusStyle.iconName as any} size={12} color={statusStyle.icon} />
            <Text className={cn('text-xs font-medium', statusStyle.text)}>
              {item.verify_flg_desc}
            </Text>
          </View>
        </View>

        <View className="my-2 h-[1px] bg-border" />

        <View className="mt-2 flex-row justify-between">
          <View className="flex-1">
            <Text variant="subtext" size="xs" className="mb-1 font-medium text-graphite">
              Duration
            </Text>
            <View className="flex-row items-center">
              <Text className="text-sm font-semibold text-foreground">
                {formatDate(item.from_dt1)}
              </Text>
              <Text className="mx-2 text-graphite">→</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatDate(item.to_dt1)}
              </Text>
            </View>
            <Text className="mt-1 text-xs font-medium text-primary">
              {parseInt(item.no_days)} Days
            </Text>
          </View>
        </View>

        {item.reason_for_leave && (
          <View className="mt-3 rounded-lg bg-surface-soft p-3">
            <Text numberOfLines={1} variant="caption-sm" className="italic text-charcoal">
              {item.reason_for_leave}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};
