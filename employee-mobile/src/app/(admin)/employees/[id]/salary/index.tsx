import { StatementScreen } from '@/src/components/screen/statements';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const { id } = useLocalSearchParams();

  return <StatementScreen idx={id.toString()} />;
}
