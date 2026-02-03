import { useAuth } from '@/src/hooks/auth/useAuth';

import colors from 'tailwindcss/colors';

import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, Route, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernButton } from '../ui/button';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/src/store/theme';

export type MenuItemsT = {
  id: number;
  title: string;
  href: Route;
};

const menuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Settings', href: '/settings' },
];

const adminDrawerMenuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Employees', href: '/employees' },
  { id: 4, title: 'Settings', href: '/settings' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bgColor = isDark ? colors.slate[900] : colors.white;

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  let items: MenuItemsT[] = isAdmin ? adminDrawerMenuItems : menuItems;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: bgColor,
      }}>
      <View className="mb-6 flex-row items-center justify-center pt-4">
        <Text className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <View className="flex-1 flex-col gap-2 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href} asChild>
              <Pressable
                className={`flex-row items-center rounded-xl p-4 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'
                  }`}>
                <Text
                  className={`text-base font-medium ${isActive
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400'
                    }`}>
                  {item.title}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
