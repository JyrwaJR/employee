import { HeaderStack } from '@/src/shared/components/common/Header';
import SettingsScreen from '@/src/features/settings/screens/SettingsScreen';

export default function page() {
  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
