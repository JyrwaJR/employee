import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { useTheme } from '@/src/store/theme';
import { View, Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Header } from './Header';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from './ThemeToggle';

const TabIcon = ({
  name,
  label,
  icon,
}: {
  name: string;
  label: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}) => {
  const pathname = usePathname();
  // Simple check: if we are at root and name is index, or if pathname includes the name
  const isActive =
    (pathname === '/' && name === 'index') || (pathname !== '/' && pathname.includes(name));

  const theme = useTheme();
  // Active color: Blue 600, Inactive: Gray 400 (light) / Gray 500 (dark)
  const activeColor = '#2563EB';
  const inactiveColor = theme === 'dark' ? '#9CA3AF' : '#9CA3AF';

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.2 : 1, { damping: 10, stiffness: 100 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { alignItems: 'center', gap: 4 }]}>
      {icon({
        color: isActive ? activeColor : inactiveColor,
        size: 24,
      })}
      <Text
        style={{
          color: isActive ? activeColor : inactiveColor,
          fontSize: 10,
          fontWeight: '500',
        }}>
        {label}
      </Text>
      {isActive && (
        <View className="absolute -bottom-2 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />
      )}
    </Animated.View>
  );
};

const TabLayout = () => {
  const { role } = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  // TODO: Add NPS check form backend as user profile
  const isNPS = false;
  const insets = useSafeAreaInsets();

  const getTitle = () => {
    if (pathname.includes('/statement')) return 'Statements';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/pension')) return isNPS ? 'NPS' : 'Pension';
    if (pathname.includes('/leave')) return 'Leave';
    return 'Home';
  };

  return (
    <Tabs asChild>
      <View className="flex-1 bg-white dark:bg-slate-950">
        <Header
          title={getTitle()}
          leftIcon={<DrawerToggleButton tintColor={theme === 'dark' ? 'white' : 'black'} />}
          rightIcon={<ThemeToggle />}
          showBackButton={false}
        />
        <TabSlot />
        <TabList
          className="flex-row items-center justify-center gap-0 border-t border-gray-200 bg-white px-4 py-2 shadow-sm dark:border-gray-800 dark:bg-slate-950"
          style={{ paddingBottom: insets.bottom + 8 }}>
          <TabTrigger name="index" href={role === 'SUPER_ADMIN' ? '/' : '/profile'} asChild>
            <Pressable className="items-center justify-center p-2">
              <TabIcon
                name="index"
                label="Home"
                icon={(props) => <MaterialIcons name="home" {...props} />}
              />
            </Pressable>
          </TabTrigger>

          <TabTrigger name="statement" href="/statement" asChild>
            <Pressable className="items-center justify-center p-2">
              <TabIcon
                name="statement"
                label="Statements"
                icon={(props) => <MaterialIcons name="receipt" {...props} />}
              />
            </Pressable>
          </TabTrigger>

          <TabTrigger name="leave" href="/leave" asChild>
            <Pressable className="items-center justify-center p-2">
              <TabIcon
                name="leave"
                label="Leaves"
                icon={(props) => <MaterialIcons name="air" {...props} />}
              />
            </Pressable>
          </TabTrigger>
          <TabTrigger name="pension" href="/pension" asChild>
            <Pressable className="items-center justify-center p-2">
              <TabIcon
                name="pension"
                label={isNPS ? 'NPS' : 'Pension'}
                icon={(props) => <MaterialIcons name="tag" {...props} />}
              />
            </Pressable>
          </TabTrigger>

          {role === 'SUPER_ADMIN' && (
            <TabTrigger name="profile" href="/profile" asChild>
              <Pressable className="items-center justify-center p-2">
                <TabIcon
                  name="profile"
                  label="Profile"
                  icon={(props) => <MaterialIcons name="person" {...props} />}
                />
              </Pressable>
            </TabTrigger>
          )}
        </TabList>
      </View>
    </Tabs>
  );
};

TabLayout.displayName = 'TabLayout';

export default TabLayout;
