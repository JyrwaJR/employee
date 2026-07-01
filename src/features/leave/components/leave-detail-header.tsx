import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { getStatusColor } from '@utils/helpers/get-status-color';
import { Leave } from '@sharedTypes/leave';
import { LeaveTypeCode } from '../types';
import { LEAVE_ICONS } from '../utils/constants';

/**
 * Props accepted by the {@link LeaveDetailHeader} component.
 */
interface LeaveDetailHeaderProps {
  /** The full leave record to render the header for. */
  leave: Leave;
}

/**
 * Displays the top section of the leave detail screen.
 *
 * Renders a card containing the leave-type icon (dynamically selected
 * via {@link LEAVE_ICONS} based on `leave.leave_cd`), the leave
 * description as the title, the duration in days, and a status badge
 * coloured by {@link getStatusColor} according to the verification
 * status (`leave.verify_flg_desc`).
 *
 * The status badge uses the icon and colour scheme returned by
 * `getStatusColor` to provide a quick visual indication of whether
 * the leave is approved, pending, or rejected.
 *
 * @example
 * ```tsx
 * <LeaveDetailHeader leave={leave} />
 * ```
 */
export const LeaveDetailHeader = ({ leave }: LeaveDetailHeaderProps) => {
  const statusStyle = getStatusColor(leave.verify_flg_desc);

  return (
    <View className="mt-4">
      <View className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="rounded-2xl bg-purple-100 p-3 dark:bg-purple-900/30">
            <MaterialCommunityIcons
              name={LEAVE_ICONS[leave.leave_cd as LeaveTypeCode] ?? 'calendar-account'}
              size={32}
              color={statusStyle.icon}
            />
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
