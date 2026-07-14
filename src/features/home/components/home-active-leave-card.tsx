import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { cn } from '@utils/helpers/cn';
import { LeaveListItem } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { getStatusColor } from '@utils/helpers';

interface HomeActiveLeaveCardProps {
  leave: LeaveListItem;
}

export const HomeActiveLeaveCard = ({ leave }: HomeActiveLeaveCardProps) => (
  <Card>
    <CardContent className="p-5">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Icon name="umbrella" size={22} color="#024ad8" />
          <Text variant="heading" size="lg" className="ml-2 text-foreground">
            Active Leave
          </Text>
        </View>
        <View className={cn('rounded-full px-3 py-1', getStatusColor(leave.verify_flg_desc).bg)}>
          <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-charcoal">{leave.leave_cd}</Text>
          <Text variant="subtext" size="sm">
            {formatDate(leave.from_dt)} — {formatDate(leave.to_dt)}
          </Text>
        </View>
        <Text className="text-lg font-bold text-foreground">
          {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </CardContent>
  </Card>
);
