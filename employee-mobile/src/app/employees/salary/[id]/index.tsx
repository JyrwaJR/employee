import { PayslipScreen } from '@/src/components/screen/statements/PayslipScreen';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { NotFoundScreen } from '@/src/components/common/NotFoundScreen';

export default function Page() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Payslip',
          headerShown: true,
          headerBackButtonDisplayMode: 'generic',
        }}
      />
      <PayslipScreen salaryId={id.toString()} />
    </>
  );
}
