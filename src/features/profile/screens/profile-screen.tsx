import React from 'react';
import { View, Image, ScrollView, StatusBar, Alert } from 'react-native';
import { Container } from '@/src/shared/components/layout/container';
import { useAuth } from '@/src/shared/hooks/use-auth';
import { Text } from '@/src/shared/components/ui/text';
import { useThemeStore } from '@/src/shared/stores/theme.store';
import { SettingRow } from '@/src/shared/components/display/setting-row';
import { ProfileDetailRow } from '../components/profile-detail-row';

export const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { user, logout } = useAuth();
  const { theme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
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
            <SettingRow
              icon="bell-outline"
              label="Notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <SettingRow icon="lock-outline" label="Change Password" onPress={() => {}} />
            <SettingRow icon="file-document-outline" label="Service Record" onPress={() => {}} />
            <SettingRow
              icon="logout"
              label="Log Out"
              isDestructive
              onPress={handleLogout}
              showBorder={false}
            />
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
