import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';

interface SectionHeaderProps {
  /** The heading text. */
  title: string;
  /** Optional emoji / icon character displayed in a rounded container. */
  icon?: string;
  /** Optional subtitle shown below the title. */
  subtitle?: string;
  /** Optional element rendered on the right side of the header row. */
  rightElement?: React.ReactNode;
  /** Content rendered below the header, only supported in splash variant. */
  children?: React.ReactNode;
  className?: string;
  variant?: 'section' | 'splash';
}

/**
 * SectionHeader renders a section heading with optional icon, subtitle, and right-side content.
 *
 * Two variants:
 * - `section` — A clean heading with a left accent bar, optional icon, and a subtle bottom separator.
 * - `splash` — A full-width banner with rounded bottom corners, suited for page top headers.
 */
export const SectionHeader = ({
  title,
  icon,
  subtitle,
  rightElement,
  className,
}: SectionHeaderProps) => {
  return (
    <View className={cn('mb-7', className)}>
      <View className="flex-row items-center gap-x-4">
        {/* Left accent bar */}
        <View className="h-10 w-[3px] rounded-full bg-blue-500" />

        {/* Icon */}
        {icon && (
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
            <Text className="text-xl">{icon}</Text>
          </View>
        )}

        {/* Title + subtitle */}
        <View className="flex-1">
          <Text
            variant="heading"
            size="3xl"
            weight="bold"
            className="text-gray-900 dark:text-white">
            {title}
          </Text>
          {subtitle && (
            <Text variant="subtext" size="sm" className="mt-1">
              {subtitle}
            </Text>
          )}
        </View>

        {rightElement}
      </View>

      {/* Separator */}
      <View className="ml-[23px] mt-4 h-[2px] rounded-full bg-gray-100 dark:bg-gray-800" />
    </View>
  );
};
