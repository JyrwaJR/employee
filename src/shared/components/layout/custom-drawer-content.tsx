import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, Route, usePathname } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { Icon } from '@components/ui';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { Text } from '@components/ui/text';

export type MenuItemsT = {
  id?: number;
  title: string;
  href: Route;
  icon: IoniconsIconName;
};

const menuItems: MenuItemsT[] = [
  { title: 'Home', href: '/' as Route, icon: 'home-outline' },
  { title: 'Income Tax', href: '/tax' as Route, icon: 'cash-outline' },
  { title: 'Settings', href: '/settings' as Route, icon: 'settings-outline' },
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
        <Text className={cn('text-center text-2xl font-semibold')}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <View className="flex-1 flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.title + item.href} href={item.href} asChild>
              <Pressable
                className={cn(
                  'flex-row items-center gap-2 rounded-md p-4',
                  isActive ? 'bg-primary-soft' : 'bg-transparent'
                )}>
                <Icon name={item.icon} size={24} color={isActive ? 'primary' : ''} />
                <Text
                  className={cn(
                    'ml-2 text-base font-medium',
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
