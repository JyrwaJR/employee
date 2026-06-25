import React, { memo, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSegments, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/use-theme';
import { Text } from '@components/ui/text';
import { cn } from '@utils/helpers/cn';
import { PAGE_HEADERS, type PageHeaderConfig } from '@config/page-headers';

/**
 * Derives the current route path by filtering out layout-group segments.
 */
function useRoutePath(): string {
  const segments = useSegments();
  const filtered = segments.filter((s) => !s.startsWith('(') && !s.startsWith(')'));
  return '/' + filtered.join('/');
}

/**
 * Match a path against page header configs, including dynamic route patterns.
 */
function matchConfig(path: string): PageHeaderConfig | null {
  if (PAGE_HEADERS[path as keyof typeof PAGE_HEADERS])
    return PAGE_HEADERS[path as keyof typeof PAGE_HEADERS]!;
  const keys = Object.keys(PAGE_HEADERS).sort((a, b) => b.split('/').length - a.split('/').length);
  for (const key of keys) {
    if (!key.includes('[')) continue;
    const pattern = key.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) return PAGE_HEADERS[key as keyof typeof PAGE_HEADERS]!;
  }
  return null;
}

export interface StackHeaderProps {
  title?: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  showBackButton?: boolean;
}

/**
 * A header component driven by the current route, automatically resolving
 * title, subtitle, slots, and back-button visibility from page header config.
 * Accepts optional props that override the config-derived values.
 */
export const StackHeader = memo(
  ({
    title: titleProp,
    subtitle: subtitleProp,
    leftSlot: leftSlotProp,
    rightSlot: rightSlotProp,
    showBackButton: showBackProp,
  }: StackHeaderProps = {}) => {
    const path = useRoutePath();
    const config = useMemo(() => matchConfig(path), [path]);
    const router = useRouter();
    const navigation = useNavigation();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const canGoBack = navigation.canGoBack();

    const handleBack = useCallback(() => router.back(), [router]);

    const hasExplicitProps =
      titleProp !== undefined ||
      subtitleProp !== undefined ||
      leftSlotProp !== undefined ||
      rightSlotProp !== undefined ||
      showBackProp !== undefined;

    if (!config && !hasExplicitProps) return null;

    const title = titleProp ?? config?.title ?? '';
    const subtitle = subtitleProp ?? config?.subtitle;
    const leftSlot = leftSlotProp ?? config?.leftSlot;
    const rightSlot = rightSlotProp ?? config?.rightSlot;
    const showBack = canGoBack && (showBackProp ?? config?.showBackButton ?? false);

    return (
      <View
        className={cn('bg-white dark:bg-slate-950', config?.background || '')}
        style={{ paddingTop: insets.top }}>
        <View className="min-h-[56px] flex-row items-center justify-between px-4 py-3">
          <View className="flex-1 flex-row items-center justify-start">
            {showBack && (
              <TouchableOpacity
                onPress={handleBack}
                className="mr-3"
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                activeOpacity={0.7}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={theme === 'dark' ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
            )}
            {leftSlot}
          </View>

          <View className="flex-[3] items-center justify-center">
            <Text variant="heading" size="lg" weight="semibold" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="subtext" size="xs" numberOfLines={1} className="mt-0.5">
                {subtitle}
              </Text>
            )}
          </View>

          <View className="flex-1 flex-row items-center justify-end">{rightSlot}</View>
        </View>

        {config?.bottomContent && <View className="px-4 pb-3">{config.bottomContent}</View>}
      </View>
    );
  }
);

StackHeader.displayName = 'StackHeader';
