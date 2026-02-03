import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { cn } from '@/src/libs/cn';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterCardProps {
  // Collapsible Props
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;

  // Status Filter
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];

  // Year Filter
  year?: string;
  onYearChange?: (value: string) => void;
  years?: string[];

  // Month Filter
  month?: string;
  onMonthChange?: (value: string) => void;
  months?: string[];

  className?: string;
}

const FilterChip = ({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
    className={cn(
      'mr-3 rounded-full border px-4 py-1.5',
      selected
        ? 'border-blue-600 bg-blue-600'
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    )}>
    <Text
      className={cn(
        'text-xs font-semibold',
        selected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
      )}>
      {label}
    </Text>
  </TouchableOpacity>
);

const SectionLabel = ({ title }: { title: string }) => (
  <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-gray-400">
    {title}
  </Text>
);

export const FilterCard = ({
  isOpen: externalIsOpen,
  onToggle,
  status,
  onStatusChange,
  statusOptions,
  year,
  onYearChange,
  years,
  month,
  onMonthChange,
  months,
  className,
}: FilterCardProps) => {
  // Internal state for when external state is not provided
  const [internalIsOpen, setInternalIsOpen] = useState(externalIsOpen ?? false);

  // Sync internal state if external state changes
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const handleToggle = () => {
    const newState = !internalIsOpen;
    if (externalIsOpen === undefined) {
      setInternalIsOpen(newState);
    }
    onToggle?.(newState);
  };

  const showContent = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const hasStatus = status !== undefined && statusOptions && statusOptions.length > 0;
  const hasYears = year !== undefined && years && years.length > 0;
  const hasMonths = month !== undefined && months && months.length > 0;

  if (!hasStatus && !hasYears && !hasMonths) {
    return null;
  }

  return (
    <View
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className
      )}>
      {/* Header / Toggle Button */}
      <TouchableOpacity
        onPress={handleToggle}
        className="flex-row items-center justify-between rounded-t-2xl bg-gray-50/50 p-4 dark:bg-white/5">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="filter-variant" size={16} color="#64748B" />
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filters</Text>
        </View>
        <MaterialCommunityIcons
          name={showContent ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {/* Collapsible Content */}
      {showContent && (
        <View className="px-4 pb-4 pt-2">
          {/* Status Section */}
          {hasStatus && (
            <View className="mb-4">
              <SectionLabel title="Status" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {statusOptions?.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={status === option.value}
                    onPress={() => onStatusChange?.(option.value)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Year Section */}
          {hasYears && (
            <View className={cn(hasStatus && 'mt-2', hasMonths ? 'mb-4' : '')}>
              <SectionLabel title="Year" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {years?.map((y) => (
                  <FilterChip
                    key={y}
                    label={y}
                    selected={year === y}
                    onPress={() => onYearChange?.(y)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Month Section */}
          {hasMonths && (
            <View className={cn((hasStatus || hasYears) && 'mt-2')}>
              <SectionLabel title="Month" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {months?.map((m) => (
                  <FilterChip
                    key={m}
                    label={m}
                    selected={month === m}
                    onPress={() => onMonthChange?.(m)}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
