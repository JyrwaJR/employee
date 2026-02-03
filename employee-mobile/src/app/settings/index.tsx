import { HeaderStack } from '@/src/components/common/Header';
import SettingsScreen from '@/src/components/screen/settings';

export default function page() {
  return (
    <>
      <HeaderStack title="Settings" />
      <SettingsScreen />
    </>
  );
}
