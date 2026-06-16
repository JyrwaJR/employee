import { StatementScreen } from '@/src/features/salary/screens/SalaryStatementsScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const { id } = useLocalSearchParams();

  return <StatementScreen idx={id.toString()} />;
}
