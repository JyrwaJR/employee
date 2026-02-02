import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Container } from '../../common/Container';
import { cn } from '@/src/libs/cn';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { TokenStoreManager } from '@/src/libs/stores/auth';
import { toast } from 'sonner-native';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { StatBox } from '../../common/StatsBox';
import { Text } from '../../ui/text';
import { useThemeStore } from '@/src/store/theme';

/**
 * A reusable row for settings options (e.g., "Change Password")
 */
interface MenuRowProps {
  icon: string;
  label: string;
  isDestructive?: boolean;
  hasArrow?: boolean;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

const MenuRow = ({
  icon,
  label,
  isDestructive,
  hasArrow = true,
  onPress,
  rightElement,
}: MenuRowProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 py-4 last:border-0">
    <View className="flex-row items-center">
      <View
        className={cn(
          'mr-4 h-10 w-10 items-center justify-center rounded-full',
          isDestructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'
        )}>
        <Text className={cn('text-lg', isDestructive ? 'text-red-500' : 'text-gray-600 dark:text-gray-300')}>
          {icon}
        </Text>
      </View>
      <Text
        className={cn('text-base font-medium', isDestructive ? 'text-red-600' : 'text-gray-900 dark:text-white')}>
        {label}
      </Text>
    </View>

    {rightElement ? (
      rightElement
    ) : hasArrow ? (
      <Text className="text-lg text-gray-300">›</Text>
    ) : null}
  </TouchableOpacity>
);

/**
 * Small stat box for "Leaves", "Attendance", etc.
 */

// --- Main Screen ---

export const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { user } = useAuth();
  const { refresh } = useAuth();
  const { theme } = useThemeStore();

  const { mutate } = useMutation({
    mutationFn: (refresh_token: string) => http.post(AUTH_ENDPOINTS.POST_LOGOUT, { refresh_token }),
    onSuccess: async (data) => {
      if (data.success) {
        await TokenStoreManager.removeToken();
        await TokenStoreManager.removeRefreshToken();
        refresh();
        return data;
      }
      toast.error(data.message);
    },
  });

  const onLogout = async () => {
    const refreshToken = await TokenStoreManager.getRefreshToken();
    if (refreshToken) {
      mutate(refreshToken);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => onLogout() },
    ]);
  };

  return (
    <Container className="flex-1">
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* --- 1. Header Section (Sticky-ish look) --- */}
      <View className="z-10 rounded-b-[32px] bg-white dark:bg-gray-900 px-6 pb-8 pt-5 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <View className="items-center">
          <View className="relative">
            <Image
              source={{ uri: user?.avatar }}
              className="mb-4 h-24 w-24 rounded-full border-4 border-gray-50 dark:border-gray-800"
            />
            <TouchableOpacity className="absolute bottom-4 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-gray-900 bg-blue-600">
              <Text className="text-xs text-white">✎</Text>
            </TouchableOpacity>
          </View>

          <Text variant="heading" size="2xl" className="text-center tracking-tight text-gray-900 dark:text-white">
            {user?.first_name}
          </Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{user?.role}</Text>
          <View className="mt-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
            <Text variant="subtext" className="text-xs font-medium">ID: {user?.id}</Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="mt-8 flex-row">
          <StatBox label="Leaves Left" value="12" color="text-green-600 dark:text-green-400" />
          <StatBox label="Attendance" value="98%" color="text-blue-600 dark:text-blue-400" />
          <StatBox label="Late Days" value="2" color="text-orange-500 dark:text-orange-400" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* --- 2. Personal Info Card --- */}
        <View className="mb-6">
          <Text className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-gray-400">
            Contact Details
          </Text>
          <View className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                <Text>📧</Text>
              </View>
              <View>
                <Text variant="subtext" className="text-xs">Official Email</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</Text>
              </View>
            </View>
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <Text>📞</Text>
              </View>
              <View>
                <Text variant="subtext" className="text-xs">Phone</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{user?.phone}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20">
                <Text>🏢</Text>
              </View>
              <View>
                <Text variant="subtext" className="text-xs">Department</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{user?.department}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- 3. Settings Menu --- */}
        <View className="mb-8">
          <Text className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-gray-400">
            Settings
          </Text>
          <View className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm">
            {/* Toggle Row */}
            <MenuRow
              icon="🔔"
              label="Notifications"
              hasArrow={false}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E5E7EB', true: '#2563EB' }} // Blue 600
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E7EB"
                />
              }
            />

            <MenuRow icon="🔒" label="Change Password" onPress={() => { }} />

            <MenuRow icon="📄" label="Terms & Privacy" onPress={() => { }} />

            <MenuRow icon="🛡️" label="Support" onPress={() => { }} />

            <MenuRow
              icon="🚪"
              label="Log Out"
              isDestructive
              hasArrow={false}
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-xs text-gray-400">v1.2.4 (Build 405)</Text>
        </View>
      </ScrollView>
    </Container>
  );
};
