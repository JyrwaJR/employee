import { PayslipScreen } from '@/src/components/screen/statements/PayslipScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();
  return <PayslipScreen salaryId={id.toString()} />;
}
