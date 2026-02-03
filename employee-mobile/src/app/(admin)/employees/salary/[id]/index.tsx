import { PayslipScreen } from '@/src/components/screen/statements/PayslipScreen';
import { useLocalSearchParams } from 'expo-router';
import { HeaderStack } from '@/src/components/common/Header';

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <HeaderStack title="Payslip" />
      <PayslipScreen salaryId={id.toString()} />
    </>
  );
}
