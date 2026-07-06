import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';
import { Leave } from '@sharedTypes/leave';
import { Icon } from '@components/ui/icon';

/**
 * Props accepted by the {@link LeaveDetailInfo} component.
 */
interface LeaveDetailInfoProps {
  /** The full leave record whose detail fields to render. */
  leave: Leave;
}

/**
 * Renders a single labelled row inside the leave details card.
 *
 * Each row consists of an {@link Icon} icon on the
 * left, a label (uppercase, subtle) above the value on the right.
 *
 * @param icon - Name of the Icon glyph to display.
 * @param label - Short label text (e.g. `From`, `To`, `Duration`).
 * @param value - The value text shown below the label.
 */
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="mb-4 flex-row items-start">
    <View className="mr-3 mt-0.5 w-6 items-center">
      <Icon name={icon as any} size={20} color="#6B7280" />
    </View>
    <View className="flex-1">
      <Text variant="subtext" size="xs" className="mb-0.5 font-medium uppercase tracking-wide">
        {label}
      </Text>
      <Text className="text-sm font-medium text-gray-900 dark:text-white">{value}</Text>
    </View>
  </View>
);

export const LeaveDetailInfo = ({ leave }: LeaveDetailInfoProps) => (
  <View className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
      Leave Details
    </Text>
    <InfoRow icon="calendar-range" label="From" value={leave.from_dt} />
    <InfoRow icon="calendar-check" label="To" value={leave.to_dt} />
    <InfoRow
      icon="counter"
      label="Duration"
      value={`${leave.no_days} ${parseInt(leave.no_days) === 1 ? 'day' : 'days'}`}
    />
    <InfoRow icon="clipboard-text" label="Leave Type" value={leave.leave_desc} />
    <InfoRow icon="calendar-clock" label="Order Date" value={leave.order_dt} />
    {leave.reason_for_leave && (
      <View className="mt-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <Text variant="subtext" size="xs" className="mb-1.5 font-medium uppercase tracking-wide">
          Reason
        </Text>
        <Text className="text-sm leading-5 text-gray-700 dark:text-gray-300">
          {leave.reason_for_leave}
        </Text>
      </View>
    )}
  </View>
);
