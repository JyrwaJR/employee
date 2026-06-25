import { StackHeader } from '@components/layout/stack-header';
import { SignUpScreen } from '@features/auth/screens/sign-up-screen';

export default function page() {
  return (
    <>
      <StackHeader title="Sign Up" />
      <SignUpScreen />
    </>
  );
}
