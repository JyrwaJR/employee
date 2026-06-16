import EmployeeDetailScreen from '@/src/features/employee/screens/employee-details';
import { useAuth } from '@/src/shared/hooks/use-auth';
import { NotFoundScreen } from '@/src/shared/components/screens/not-found-screen';
import { HeaderStack } from '@/src/shared/components/layout/header';

export default function Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }
  return (
    <>
      <HeaderStack title="Employee Details" />
      <EmployeeDetailScreen />
    </>
  );
}
