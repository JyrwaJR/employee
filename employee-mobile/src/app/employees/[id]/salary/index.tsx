import { StatementScreen } from '@/src/components/screen/statements';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { NotFoundScreen } from '@/src/components/common/NotFoundScreen';

export default function Home() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  if (!isAdmin) {
    return <NotFoundScreen title="Unauthorized" message="You don't have access to this page." />;
  }
  return <StatementScreen idx={id.toString()} />;
}
