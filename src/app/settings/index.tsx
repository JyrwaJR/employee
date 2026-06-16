import { HeaderStack } from '@/src/shared/components/layout/Header';
import { SettingsScreen } from '@/src/features/settings/screens/SettingsScreen';

export default function Page() {
  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
