import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, Route, usePathname } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@utils/helpers/cn';

export type MenuItemsT = {
  id?: number;
  title: string;
  href: Route;
};

const menuItems: MenuItemsT[] = [
  { title: 'Home', href: '/' as Route },
  { title: 'Income Tax', href: '/tax' as Route },
  { title: 'Settings', href: '/settings' as Route },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
      }}
      className="bg-background">
      <View className="mb-6 flex-row items-center justify-center pt-4">
        <Text className="text-center text-2xl font-bold text-foreground">
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <View className="flex-1 flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href} asChild>
              <Pressable
                className={cn(
                  'flex-row items-center rounded-xl p-4',
                  isActive ? 'bg-primary-soft' : 'bg-transparent'
                )}>
                <Text
                  className={cn(
                    'text-base font-medium',
                    isActive ? 'text-primary' : 'text-charcoal'
                  )}>
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
