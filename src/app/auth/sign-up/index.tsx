import { HeaderStack } from '@/src/shared/components/layout/Header';
import { SignUpScreen } from '@/src/features/auth/screens/SignUpScreen';

export default function page() {
  return (
    <>
      <HeaderStack title="Sign Up" />
      <SignUpScreen />
    </>
  );
}
