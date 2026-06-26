import React, { memo, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSegments, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/use-theme';
import { Text } from '@components/ui/text';
import { cn } from '@utils/helpers/cn';
import { PAGE_HEADERS, type PageHeaderConfig } from '@config/page-headers';
import { DrawerToggleButton } from '@react-navigation/drawer';

function useRoutePath(): string {
  const segments = useSegments();
  const filtered = segments.filter((s) => !s.startsWith('(') && !s.startsWith(')'));
  return '/' + filtered.join('/');
}

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

export const StackHeader = memo(() => {
  const path = useRoutePath();
  const config = useMemo(() => matchConfig(path), [path]);
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  const handleBack = useCallback(() => router.back(), [router]);

  if (!config) return null;

  const showBack = config.showBackButton && canGoBack;
  const showDrawer = config.showDrawer;

  return (
    <View
      className={cn('border-b border-gray-200 bg-white dark:bg-slate-950', config.background || '')}
      style={{ paddingTop: insets.top }}>
      <View className="min-h-[56px] flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 flex-row items-center justify-start">
          {showDrawer ? (
            <DrawerToggleButton />
          ) : (
            showBack && (
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
            )
          )}
        </View>

        <View className="flex-[3] items-center justify-center">
          <Text variant="heading" size="lg" weight="semibold" numberOfLines={1}>
            {config.title}
          </Text>
          {config.subtitle && (
            <Text variant="subtext" size="xs" numberOfLines={1} className="mt-0.5">
              {config.subtitle}
            </Text>
          )}
        </View>

        <View className="flex-1 flex-row items-center justify-end" />
      </View>

      {config.bottomContent && <View className="px-4 pb-3">{config.bottomContent}</View>}
    </View>
  );
});

StackHeader.displayName = 'StackHeader';
