import EmployeeListScreen from '@features/employee/screens/employee-list-screen';
import { useAuthStore } from '@stores/auth.store';
import { NotFoundScreen } from '@components/screens/not-found-screen';

export default function Page() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }

  return <EmployeeListScreen />;
}
