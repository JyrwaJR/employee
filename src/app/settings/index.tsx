import { HeaderStack } from '@/src/shared/components/layout/header';
import { SettingsScreen } from '@/src/features/settings/screens/settings-screen';

export default function Page() {
  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
