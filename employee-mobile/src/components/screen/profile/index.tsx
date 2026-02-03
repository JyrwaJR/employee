import React from 'react';
import { View, Image, TouchableOpacity, ScrollView, StatusBar, Switch, Alert } from 'react-native';
import { Container } from '../../common/Container';
import { cn } from '@/src/libs/cn';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { TokenStoreManager } from '@/src/libs/stores/auth';
import { toast } from 'sonner-native';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { Text } from '../../ui/text';
import { useThemeStore } from '@/src/store/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Clean, minimal row for details (Label: Value)
 */
const ProfileDetailRow = ({ label, value }: { label: string; value: string | undefined }) => (
  <View className="flex-row justify-between border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
    <Text variant="subtext" className="w-1/3 text-sm font-medium">
      {label}
    </Text>
    <Text className="flex-1 text-right text-sm font-medium text-gray-900 dark:text-white">
      {value || '-'}
    </Text>
  </View>
);

/**
 * Minimal settings row
 */
interface MenuRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  isDestructive?: boolean;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

const MenuRow = ({ icon, label, isDestructive, onPress, rightElement }: MenuRowProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center justify-between border-b border-gray-100 py-4 last:border-0 dark:border-gray-800">
    <View className="flex-row items-center gap-3">
      <MaterialCommunityIcons name={icon} size={20} color={isDestructive ? '#EF4444' : '#64748B'} />
      <Text
        className={cn(
          'text-sm font-medium',
          isDestructive ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'
        )}>
        {label}
      </Text>
    </View>
    {rightElement || <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />}
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { user, refresh } = useAuth();
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
    <Container className="flex-1 bg-gray-50 dark:bg-slate-950">
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header / Govt Branding */}
      <View className="border-b border-gray-200 bg-white px-6 pb-4 pt-4 dark:border-gray-800 dark:bg-gray-900">
        <View className="mb-4 items-center">
          <View className="mb-2 h-10 w-10 items-center justify-center opacity-80">
            <Text className="text-2xl">🏛️</Text>
          </View>
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Government of India
          </Text>
          <Text variant="heading" size="lg" className="mt-1 text-gray-900 dark:text-white">
            Employee Profile
          </Text>
        </View>

        {/* Identity Card Style Block */}
        <View className="flex-row items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Image source={{ uri: user?.avatar }} className="h-16 w-16 rounded-md bg-gray-200" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="mt-1 text-xs font-medium uppercase text-blue-700 dark:text-blue-400">
              {user?.role}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              ID:{' '}
              <Text className="font-mono text-gray-700 dark:text-gray-300">
                {user?.employee_id || user?.id}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Employment Record */}
        <View className="mb-6">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Employment Details
          </Text>
          <View className="rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
            <ProfileDetailRow label="Department" value={user?.department} />
            <ProfileDetailRow label="Designation" value={user?.role} />
            <ProfileDetailRow label="Location" value={user?.location} />
            <ProfileDetailRow label="Official Email" value={user?.email} />
            <ProfileDetailRow label="Phone" value={user?.phone} />
          </View>
        </View>

        {/* Stats / Leaves - Tabular */}
        <View className="mb-6">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Current Status
          </Text>
          <View className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Leaves Available
              </Text>
              <Text className="text-base font-bold text-green-600">12 Days</Text>
            </View>
            <View className="my-2 h-[1px] w-full bg-gray-100 dark:bg-gray-800" />
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Attendance (Current Month)
              </Text>
              <Text className="text-base font-bold text-blue-600">98%</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="mb-10">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Preferences & Account
          </Text>
          <View className="rounded-lg border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
            <MenuRow
              icon="bell-outline"
              label="Notifications"
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E7EB"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
              }
            />
            <MenuRow icon="lock-outline" label="Change Password" onPress={() => {}} />
            <MenuRow icon="file-document-outline" label="Service Record" onPress={() => {}} />
            <MenuRow icon="logout" label="Log Out" isDestructive onPress={handleLogout} />
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-8 opacity-60">
          <Text className="text-center text-[10px] text-gray-400">
            NIC e-HRMS v2.0 • Government of India
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};
