import { HeaderStack } from '@/src/shared/components/layout/header';
import { SignUpScreen } from '@/src/features/auth/screens/sign-up-screen';

export default function page() {
  return (
    <>
      <HeaderStack title="Sign Up" />
      <SignUpScreen />
    </>
  );
}
