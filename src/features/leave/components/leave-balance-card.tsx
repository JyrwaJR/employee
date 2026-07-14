import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';
import { Card } from '@components/ui/card';
import { ILeaveDetails } from '../types';
import { LeaveTypeCode } from '@sharedTypes/leave';
import { LEAVE_ICONS } from '../utils/constants';
import { Icon } from '@components/ui/icon';

interface LeaveBalanceCardProps {
  item: ILeaveDetails;
}

export const LeaveBalanceCard = ({ item }: LeaveBalanceCardProps) => (
  <View className="mt-4">
    <Text variant="heading" size="lg" className="mb-3 text-foreground">
      Leave Balance
    </Text>
    <Card variant="bordered" className="p-5">
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-3">
          <View className="rounded-xl bg-primary-soft p-2">
            <Icon
              name={(LEAVE_ICONS[item?.type as LeaveTypeCode] as any) ?? 'calendar-blank'}
              size={20}
              color="#024ad8"
            />
          </View>
          <View>
            <Text className="text-sm font-semibold text-foreground">{item.leave_desc}</Text>
            <Text variant="subtext" size="xs">
              {item.closing_bal_as_on ? `Closing as of ${item.closing_bal_as_on}` : '-'}
            </Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-foreground">{item.closing_bal}</Text>
      </View>
    </Card>
  </View>
);
