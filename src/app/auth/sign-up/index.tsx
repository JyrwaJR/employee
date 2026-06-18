import { HeaderStack } from '@components/layout/header';
import { SignUpScreen } from '@features/auth/screens/sign-up-screen';

export default function page() {
  return (
    <>
      <HeaderStack title="Sign Up" />
      <SignUpScreen />
    </>
  );
}
