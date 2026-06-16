import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemeStore } from '@/src/shared/store/theme.store';
import { Container } from '@/src/shared/components/layout/Container';
import { SectionHeader } from '@/src/shared/components/base/SectionHeader';
import { useLocalAuthStore } from '@/src/shared/store/local-auth.store';
import { SettingRow } from '@/src/shared/components/display/SettingRow';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { setIsEnabled, isEnabled } = useLocalAuthStore();

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 px-2">
        <View className="py-6">
          {/* Appearance Section */}
          <SectionHeader title="Appearance" />
          <View className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-slate-900">
            <SettingRow
              icon={theme === 'dark' ? 'weather-night' : 'weather-sunny'}
              label="Dark Mode"
              description="Adjust the appearance of the app"
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              showBorder={false}
              iconColor={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
            />
          </View>

          {/* Notifications Section */}
          <SectionHeader title="Security" />

          <View className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-slate-900">
            <SettingRow
              icon={'security'}
              label="Enable Biometric"
              description="Adjust the appearance of the app"
              value={isEnabled}
              onValueChange={(val) => setIsEnabled(val)}
              showBorder={true}
            />
          </View>

          <View className="mt-4 items-center">
            <Text className="text-sm text-gray-400 dark:text-gray-600">v1.0.0 (Build 100)</Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default SettingsScreen;
