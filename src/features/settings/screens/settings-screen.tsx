import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@components/ui/text';
import { Container } from '@components/layout/container';
import { SectionHeader } from '@components/common/section-header';
import { useLocalAuthStore } from '@stores/local-auth.store';
import { SettingRow } from '@components/common/setting-row';
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

/**
 * Settings screen for the app.
 *
 * Displays configuration sections including Appearance and Security. The Security
 * section provides a biometric toggle that requires user confirmation via an alert
 * dialog before enabling or disabling local authentication. A version label is
 * rendered at the bottom of the screen.
 *
 * Navigation is handled by Expo Router; this screen is registered at the
 * `(app)/settings` route.
 *
 * @example
 * ```tsx
 * <SettingsScreen />
 * ```
 */
export const SettingsScreen = () => {
  const { setIsEnabled, isEnabled } = useLocalAuthStore();
  const [isOpenConfirmEnableBiometric, setIsOpenConfirmEnableBiometric] = React.useState(false);

  /**
   * Handles the user's confirmation to toggle biometric authentication.
   * Closes the confirmation dialog and flips the biometric enabled state.
   */
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

          <View className="mb-8 overflow-hidden rounded-md border border-border px-4">
            <SettingRow
              icon={'shield-checkmark'}
              label="Enable Biometric"
              description="Adjust the appearance of the app"
              value={isEnabled}
              onValueChange={() => setIsOpenConfirmEnableBiometric(true)}
              showBorder={true}
            />
          </View>

          <View className="mt-4 items-center">
            <Text variant="subtext" size="sm" className="text-graphite">
              v1.0.0 (Build 100)
            </Text>
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
