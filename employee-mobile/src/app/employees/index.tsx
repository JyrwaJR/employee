import EmployeeListScreen from '@/src/components/screen/employee';
import { Stack } from 'expo-router';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { NotFoundScreen } from '@/src/components/common/NotFoundScreen';

export default function Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }
  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: 'Employees', headerBackButtonDisplayMode: 'generic' }}
      />
      <EmployeeListScreen />
    </>
  );
}
