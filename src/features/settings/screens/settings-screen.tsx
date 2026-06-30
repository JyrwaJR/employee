import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { SectionHeader } from '@components/base/section-header';
import { useLocalAuthStore } from '@stores/local-auth.store';
import { SettingRow } from '@components/display/setting-row';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
} from '@components/ui';

export const SettingsScreen = () => {
  const { setIsEnabled, isEnabled } = useLocalAuthStore();
  const [isOpenConfirmEnableBiometric, setIsOpenConfirmEnableBiometric] = React.useState(false);
  const onConfirmed = () => {
    setIsOpenConfirmEnableBiometric(false);
    setIsEnabled(!isEnabled);
  };

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 px-2">
        <View className="py-6">
          {/* Appearance Section */}
          <SectionHeader title="Appearance" />

          {/* Notifications Section */}
          <SectionHeader title="Security" />

          <View className="mb-8 overflow-hidden rounded-xl border border-gray-200 px-4 dark:border-gray-800">
            <SettingRow
              icon={'security'}
              label="Enable Biometric"
              description="Adjust the appearance of the app"
              value={isEnabled}
              onValueChange={() => setIsOpenConfirmEnableBiometric(true)}
              showBorder={true}
            />
          </View>

          <View className="mt-4 items-center">
            <Text className="text-sm text-gray-400 dark:text-gray-600">v1.0.0 (Build 100)</Text>
          </View>
        </View>
      </ScrollView>
      <AlertDialog
        open={isOpenConfirmEnableBiometric}
        onOpenChange={setIsOpenConfirmEnableBiometric}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.{' '}
              {`"${isEnabled ? 'Disable biometric' : 'Enable biometric'}"`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setIsOpenConfirmEnableBiometric(false)} />
            <AlertDialogAction
              variant="destructive"
              title="Continue"
              onPress={() => onConfirmed()}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
};

export default SettingsScreen;
