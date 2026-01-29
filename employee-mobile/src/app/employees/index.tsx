import EmployeeListScreen from '@/src/components/screen/employee';
import { Stack } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: 'Employees', headerBackButtonDisplayMode: 'generic' }}
      />
      <EmployeeListScreen />
    </>
  );
}
