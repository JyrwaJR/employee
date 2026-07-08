import React from 'react';
import { View, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { useAuthStore } from '@stores/auth.store';
import { Text } from '@components/ui/text';
import { SettingRow } from '@components/common/setting-row';
import { ProfileDetailRow } from '../components/profile-detail-row';
import { ConfirmLogoutAlert } from '../components';
import { useProfileSections } from '../hooks/use-profile-sections';

export const ProfileScreen = () => {
  const { user, emp_cd } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
  const profileSections = useProfileSections(user);

  return (
    <Container>
      {/* Header / Govt Branding */}
      <View className="border-b border-gray-200 bg-white pb-4 pt-4 dark:border-gray-800 dark:bg-gray-900">
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
              Current DDO: {user?.ddo_code} - {user?.ddo_name}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              Employee Code:&nbsp;
              <Text className="font-mono text-gray-700 dark:text-gray-300">{emp_cd || '-'}</Text>
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
        {/* Profile sections rendered as NIC portal-style cards */}
        {profileSections.map((section) => (
          <View
            key={section.title}
            className="mb-5 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {/* Section header */}
            <View className="border-b border-gray-200 bg-slate-100 px-4 py-3 dark:border-gray-700 dark:bg-slate-800">
              <Text className="font-semibold">{section.title}</Text>
            </View>

            {/* Two-column table rows */}
            {section.fields.map((field) => (
              <ProfileDetailRow key={field.label} label={field.label} value={field.value || '-'} />
            ))}
          </View>
        ))}

        {/* Settings */}
        <View className="mb-10">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Preferences & Account
          </Text>
          <View className="rounded-lg border border-gray-200 bg-white px-2 dark:border-gray-800 dark:bg-gray-900">
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
