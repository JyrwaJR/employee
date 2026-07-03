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
  /** When true, renders the background wash layer behind the floating card. Default true. */
  background?: boolean;
  /** Additional classes for the outer container. */
  className?: string;
}

/**
 * SectionHeader renders a section heading with a layered floating design.
 *
 * Features a floating card with shadow over an optional background wash surface.
 * Includes a left accent bar, optional icon container, title/subtitle, and optional right element.
 * When `background={false}`, the background wash is hidden for inline/settings-section usage.
 *
 * @example
 * ```tsx
 * <SectionHeader title="Staff Directory" />
 * <SectionHeader title="Earnings" icon="💰" subtitle="Last 12 months" />
 * <SectionHeader title="Appearance" background={false} />
 * ```
 */
export const SectionHeader = ({
  title,
  icon,
  subtitle,
  rightElement,
  background = true,
  className,
}: SectionHeaderProps) => {
  const content = (
    <View className="mx-4 pt-4">
      <View
        className="rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900"
        style={{ elevation: 2 }}>
        <View className="flex-row items-center gap-x-4">
          {/* Left accent bar */}
          <View
            className="h-10 w-[4px] rounded-full bg-bloom-coral"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
            }}
          />

          {/* Icon */}
          {icon && (
            <View className="h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-surface-soft shadow-sm dark:bg-gray-800">
              <Text className="text-lg">{icon}</Text>
            </View>
          )}

          {/* Title + subtitle */}
          <View className="flex-1">
            <Text variant="display-sm" weight="semibold" className="text-ink dark:text-white">
              {title}
            </Text>
            {subtitle && (
              <Text variant="body-md" className="mt-0.5 text-graphite dark:text-gray-400">
                {subtitle}
              </Text>
            )}
          </View>

          {rightElement}
        </View>

        {/* Separator */}
        <View className="mt-3 h-[1px] bg-hairline" />
      </View>
    </View>
  );

  if (background) {
    return <View className={cn('rounded-xl bg-surface-soft', className)}>{content}</View>;
  }

  return <View className={className}>{content}</View>;
};
