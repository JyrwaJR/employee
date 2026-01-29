import { PayslipScreen } from '@/src/components/screen/statements/PayslipScreen';
import { Stack } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Payslip', headerShown: true, headerBackButtonDisplayMode: 'minimal' }}
      />
      <PayslipScreen />
    </>
  );
}
