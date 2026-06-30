import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { Container } from '@components/layout/container';
import { useAuthStore } from '@stores/auth.store';
import { Text } from '@components/ui/text';
import { useThemeStore } from '@stores/theme.store';
import { SettingRow } from '@components/display/setting-row';
import { ProfileDetailRow } from '../components/profile-detail-row';
import { ConfirmLogoutAlert } from '../components';

export const ProfileScreen = () => {
  const { user, emp_cd } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
  const { theme } = useThemeStore();

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
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {user?.emp_fname} {user?.emp_lname}
            </Text>
            <Text className="mt-1 text-xs font-medium uppercase text-blue-700 dark:text-blue-400">
              {user?.emp_designation}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              Employee Code:&nbsp;
              <Text className="font-mono text-gray-700 dark:text-gray-300">{emp_cd || '-'}</Text>
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
            <ProfileDetailRow label="Department" value={user?.emp_dept} />
            <ProfileDetailRow label="Designation" value={user?.emp_designation} />
            <ProfileDetailRow label="Location" value={user?.emp_address} />
            <ProfileDetailRow label="Official Email" value={user?.emp_email} />
            <ProfileDetailRow label="Phone" value={user?.emp_phone} />
          </View>
        </View>

        {/* Settings */}
        <View className="mb-10">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Preferences & Account
          </Text>
          <View className="rounded-lg border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
            <SettingRow icon="lock-outline" label="Change Password" onPress={() => {}} />
            <SettingRow icon="file-document-outline" label="Service Record" onPress={() => {}} />
            <SettingRow
              icon="logout"
              label="Log Out"
              isDestructive
              onPress={() => setShowLogoutAlert(!showLogoutAlert)}
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
        <ConfirmLogoutAlert open={showLogoutAlert} onValueChange={setShowLogoutAlert} />
      </ScrollView>
    </Container>
  );
};
