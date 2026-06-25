import { PayslipScreen } from '@features/salary/screens/payslip-screen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();
  return <PayslipScreen salaryId={id.toString()} />;
}
