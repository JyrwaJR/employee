import { SalaryStatementDetailsScreen } from '@features/salary/screens/salary-statements-details-screen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();
  return <SalaryStatementDetailsScreen salaryId={id.toString()} />;
}
