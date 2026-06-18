import { PayslipScreen } from '@features/salary/screens/payslip-screen';
import { useLocalSearchParams } from 'expo-router';
import { HeaderStack } from '@components/layout/header';

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <HeaderStack title="Payslip" />
      <PayslipScreen salaryId={id.toString()} />
    </>
  );
}
