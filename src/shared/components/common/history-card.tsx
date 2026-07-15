import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@components/ui/icon';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { formatDate } from '@utils/formatters/formatters';
import { getStatusColor } from '@utils/helpers';

/** Status values returned by the salary statement API. */
type SalaryStatementStatus = 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';

/** Data shape expected by the salary statement list item card. */
type SalaryStatementListItemData = {
  id: string;
  month: string;
  year: number;
  created_at: string;
  status: SalaryStatementStatus;
  total_earnings: string;
};

/**
 * Renders a salary statement list item card with month/year, net pay,
 * and status badge.
 *
 * When `onPress` is provided, the card renders as a `TouchableOpacity`
 * with a chevron icon and navigates when tapped. When `onPress` is
 * omitted, it renders as a static `View` (non-interactive).
 */
export const SalaryStatementListItem = ({
  item,
  onPress,
}: {
  item: SalaryStatementListItemData;
  onPress?: () => void;
}) => {
  const statusStyle = getStatusColor(item.status);

  const cardContent = (
    <>
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="rounded-lg bg-primary-soft p-2">
            <Icon name="document-text-outline" size={24} color="#2563EB" />
          </View>
          <View>
            <Text className="text-lg font-bold text-foreground">
              {item.month} {item.year}
            </Text>
            <Text variant="subtext" className="text-xs font-medium">
              Credited on {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
        {onPress && <Icon name="chevron-forward" size={24} color="#94A3B8" />}
      </View>

      <View className="my-2 h-[1px] bg-muted" />

      <View className="mt-1 flex-row items-center justify-between">
        <View>
          <Text className="mb-0.5 text-xs text-graphite">Net Pay</Text>
          <Text className="text-lg font-bold text-foreground">₹{item.total_earnings}</Text>
        </View>
        <View className="items-end">
          <View
            className={cn(
              'mb-1 flex-row items-center gap-1 rounded-full px-2 py-1',
              statusStyle.bg
            )}>
            <Icon
              name={item.status === 'PAID' ? 'checkmark-circle' : 'time-outline'}
              size={12}
              color={item.status === 'PAID' ? '#166534' : '#C2410C'}
            />
            <Text className={cn('text-xs font-medium', statusStyle.bg)}>{item.status}</Text>
          </View>
          <Text className="text-[10px] text-graphite">Salary Slip</Text>
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="mb-4 rounded-md border border-border bg-card p-4 shadow-sm active:bg-gray-50 dark:active:bg-slate-800">
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View className="mb-4 rounded-md border border-border bg-card p-4 shadow-sm">
      {cardContent}
    </View>
  );
};
