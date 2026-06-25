import { Tabs, usePathname } from 'expo-router';
import { useTheme } from '@hooks/use-theme';
import { View } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/auth.store';
import { Text } from '@components/ui/text';
import { ThemeToggle } from '../../base/theme-toggle';
import { CustomTabBar } from './custom-tab-bar';
import { getTabConfig } from '@config/tabs';

export const TabLayout = () => {
  const { role } = useAuthStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const tabConfig = getTabConfig(role);

  const getTitle = () => {
    if (pathname.includes('/statement')) return 'Statements';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/pension')) return 'Pension';
    if (pathname.includes('/leave')) return 'Leave';
    return 'Home';
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <View
        className="border-b border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-slate-950"
        style={{ paddingTop: insets.top }}>
        <View className="min-h-[56px] flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center justify-start">
            <DrawerToggleButton tintColor={theme === 'dark' ? 'white' : 'black'} />
          </View>
          <View className="flex-[3] items-center justify-center">
            <Text variant="heading" size="lg" weight="semibold" numberOfLines={1}>
              {getTitle()}
            </Text>
          </View>
          <View className="flex-1 flex-row items-center justify-end">
            <ThemeToggle />
          </View>
        </View>
      </View>
      <Tabs
        key={role}
        tabBar={(props) => <CustomTabBar {...props} insets={insets} tabConfig={tabConfig} />}
        screenOptions={{
          headerShown: false,
        }}>
        {tabConfig.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
            }}
          />
        ))}
      </Tabs>
    </View>
  );
};

TabLayout.displayName = 'TabLayout';
