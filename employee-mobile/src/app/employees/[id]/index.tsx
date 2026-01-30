import EmployeeDetailScreen from '@/src/components/screen/employee/EmployeeDetails';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employee Details',
          headerBackButtonDisplayMode: 'generic',
        }}
      />
      <EmployeeDetailScreen />
    </>
  );
}
