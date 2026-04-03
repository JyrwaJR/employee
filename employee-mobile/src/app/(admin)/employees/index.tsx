import EmployeeListScreen from '@/src/features/employee/screens/EmployeeListScreen';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { NotFoundScreen } from '@/src/shared/components/common/NotFoundScreen';
import { HeaderStack } from '@/src/shared/components/common/Header';

export default function Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }
  return (
    <>
      <HeaderStack title="Employees" />
      <EmployeeListScreen />
    </>
  );
}
