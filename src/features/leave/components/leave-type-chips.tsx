import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui';
import { cn } from '@utils/helpers/cn';
import { LEAVE_TYPES } from '../utils/constants';
import type { LeaveType } from '@sharedTypes/leave';

const LEAVE_TYPE_LIST = Object.keys(LEAVE_TYPES) as LeaveType[];

interface LeaveTypeChipsProps {
  /** Currently selected leave type */
  selectedType: LeaveType;
  /** Called when a chip is pressed with the new type */
  onSelect: (type: LeaveType) => void;
  /** Optional error message to display below the chips */
  error?: string;
}

/**
 * LeaveTypeChips renders a row of tappable chips for selecting a leave type
 * (COM / EL / SL / HPL). The active chip is highlighted with a blue border.
 */
export const LeaveTypeChips = ({ selectedType, onSelect, error }: LeaveTypeChipsProps) => {
  return (
    <View className="mb-4 w-full">
      <Text variant="label" weight="medium" className="mb-2 ml-1">
        Leave Type
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {LEAVE_TYPE_LIST.map((type) => {
          const isSelected = selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              activeOpacity={0.7}
              onPress={() => onSelect(type)}
              className={cn(
                'rounded-xl border-2 px-5 py-3',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
              )}>
              <Text
                weight="semibold"
                className={cn(
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                )}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && (
        <Text variant="error" size="xs" className="ml-1 mt-2">
          {error}
        </Text>
      )}
    </View>
  );
};
