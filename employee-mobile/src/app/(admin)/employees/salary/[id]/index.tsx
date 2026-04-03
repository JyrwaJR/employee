import { PayslipScreen } from '@/src/features/salary/screens/PayslipScreen';
import { useLocalSearchParams } from 'expo-router';
import { HeaderStack } from '@/src/shared/components/common/Header';

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <HeaderStack title="Payslip" />
      <PayslipScreen salaryId={id.toString()} />
    </>
  );
}
