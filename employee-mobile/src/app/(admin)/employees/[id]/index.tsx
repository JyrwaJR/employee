import EmployeeDetailScreen from '@/src/features/employee/screens/EmployeeDetails';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { NotFoundScreen } from '@/src/shared/components/screens/NotFoundScreen';
import { HeaderStack } from '@/src/shared/components/layout/Header';

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
