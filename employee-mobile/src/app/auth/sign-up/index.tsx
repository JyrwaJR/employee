import { HeaderStack } from '@/src/components/common/Header';
import { SignUpScreen } from '@/src/components/screen/auth/SignUpScreen';

export default function page() {
  return (
    <>
      <HeaderStack title="Sign Up" />
      <SignUpScreen />
    </>
  );
}
