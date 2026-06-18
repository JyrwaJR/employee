import EmployeeListScreen from '@features/employee/screens/employee-list-screen';
import { useAuth } from '@hooks/use-auth';
import { NotFoundScreen } from '@components/screens/not-found-screen';
import { HeaderStack } from '@components/layout/header';

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
