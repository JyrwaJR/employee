import { useEffect } from 'react';
import { HeaderStack } from '@/src/shared/components/layout/Header';
import { SettingsScreen } from '@/src/features/settings/screens/SettingsScreen';

export default function page() {
  useEffect(() => {
    handleSensitiveAction();
  }, [handleSensitiveAction]);

  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
