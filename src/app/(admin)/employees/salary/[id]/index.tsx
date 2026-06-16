import { PayslipScreen } from '@/src/features/salary/screens/payslip-screen';
import { useLocalSearchParams } from 'expo-router';
import { HeaderStack } from '@/src/shared/components/layout/header';

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <HeaderStack title="Payslip" />
      <PayslipScreen salaryId={id.toString()} />
    </>
  );
}
