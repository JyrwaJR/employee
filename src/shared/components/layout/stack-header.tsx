import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSegments, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/use-theme';
import { Text } from '@components/ui/text';
import { cn } from '@utils/helpers/cn';
import { PAGE_HEADERS, type PageHeaderConfig } from '@config/page-headers';

function useRoutePath(): string {
  const segments = useSegments();
  const filtered = segments.filter((s) => !s.startsWith('(') && !s.startsWith(')'));
  return '/' + filtered.join('/');
}

function matchConfig(path: string): PageHeaderConfig | null {
  const headers = PAGE_HEADERS as Record<string, PageHeaderConfig | undefined>;
  if (headers[path]) return headers[path]!;
  const keys = Object.keys(headers).sort((a, b) => b.split('/').length - a.split('/').length);
  for (const key of keys) {
    if (!key.includes('[')) continue;
    const pattern = key.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) return headers[key]!;
  }
  return null;
}

export const StackHeader = () => {
  const path = useRoutePath();
  const config = useMemo(() => matchConfig(path), [path]);
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  if (!config) return null;

  const showBack = config.showBackButton && canGoBack;

  return (
    <View
      className={cn('bg-white dark:bg-slate-950', config.background || '')}
      style={{ paddingTop: insets.top }}>
      <View className="min-h-[56px] flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 flex-row items-center justify-start">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
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
          {config.leftSlot}
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

        <View className="flex-1 flex-row items-center justify-end">{config.rightSlot}</View>
      </View>

      {config.bottomContent && <View className="px-4 pb-3">{config.bottomContent}</View>}
    </View>
  );
};
