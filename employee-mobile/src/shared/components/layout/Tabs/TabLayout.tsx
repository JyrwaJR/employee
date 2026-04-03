import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';
import { useTheme } from '@/src/shared/hooks/use-theme';
import { View } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Header } from '../Header';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../../base/ThemeToggle';
import { CustomTabBar } from './CustomTabBar';
import { getTabConfig } from '@/src/shared/config/tabs';

const TabLayout = () => {
  const { role } = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

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
      <Header
        title={getTitle()}
        leftIcon={<DrawerToggleButton tintColor={theme === 'dark' ? 'white' : 'black'} />}
        rightIcon={<ThemeToggle />}
        showBackButton={false}
      />
      <Tabs
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

export default TabLayout;
