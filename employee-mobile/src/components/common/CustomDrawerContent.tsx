import { useAuth } from '@/src/hooks/auth/useAuth';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Route, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernButton } from '../ui/button';
import { Text, View } from 'react-native';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: Route;
};

const menuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Settings', herf: '/settings' },
];

const adminDrawerMenuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Employees', herf: '/employees' },
  { id: 3, title: 'Statements', herf: '/statement' },
  { id: 4, title: 'Settings', herf: '/settings' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  let items: MenuItemsT[] = isAdmin ? adminDrawerMenuItems : menuItems;
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
      }}>
      <View className="mb-4 flex-row items-center justify-center">
        <Text className="text-center text-2xl font-bold text-gray-900">
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <View className="p-x-5 flex-1 flex-col gap-2">
        {items.map((item) => {
          return (
            <View key={item.id} className="relative gap-2">
              <ModernButton title={item.title} onPress={() => router.push(item.herf)} />
            </View>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
