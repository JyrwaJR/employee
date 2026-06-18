import { HeaderStack } from '@components/layout/header';
import { SettingsScreen } from '@features/settings/screens/settings-screen';

export default function Page() {
  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
