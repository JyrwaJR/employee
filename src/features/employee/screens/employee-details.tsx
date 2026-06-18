import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Container } from '@components/layout/container';
import { router, useLocalSearchParams } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { useAuth } from '@hooks/use-auth';
import { Text } from '@components/ui/text';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { toast } from '@components/ui';
import { useEmployee } from '../hooks/use-employee';
import { InfoRow } from '../components/info-row';
import { SectionCard } from '../components/section-card';
import { ActionButton } from '../components/action-button';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const idx = id.toString() || '';
  const auth = useAuth();

  const { data, isFetching, isError, error } = useEmployee({ employeeId: idx });

  // Handle Query Error
  React.useEffect(() => {
    let isMounted = true;
    if (isError && isMounted) {
      toast.error('Update Failed', {
        description: (error as any)?.message || 'Could not update employee details',
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isError, error]);

  const user = data?.user;

  const currentSalary = data?.current_structure;

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="mb-6 items-center rounded-b-[32px] border-b border-gray-100 bg-white px-6 pb-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Image
            source={{ uri: `https://i.pravatar.cc/300?u=${user?.first_name}` }}
            className="mb-4 h-24 w-24 rounded-full border-4 border-white bg-gray-200 shadow-sm dark:border-gray-800"
          />
          <Text variant="heading" size="2xl" className="text-center text-gray-900 dark:text-white">
            {user?.first_name}
          </Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{user?.role}</Text>
          <View className="mt-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {data?.employee_id}
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="mt-6 w-full flex-row">
            <ActionButton
              label="Call"
              icon="📞"
              onPress={() => Linking.openURL(`tel:${user?.phone}`)}
            />
            <ActionButton
              label="Email"
              icon="✉️"
              onPress={() => Linking.openURL(`mailto:${user?.email}`)}
              primary
            />
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-10">
          <SectionCard title="Official Details">
            <InfoRow label="Department" value={data?.department ?? ''} icon="🏢" />
            <InfoRow label="Office Location" value={data?.office_location ?? ''} icon="📍" />
            <InfoRow label="Date of Joining" value={data?.date_of_joining || ''} icon="📅" />
          </SectionCard>

          <SectionCard title="Financial Overview">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-medium uppercase text-gray-400">
                  Current Pay Level
                </Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {data?.pay_level || '-'}
                </Text>
              </View>
              <View className="rounded-lg bg-green-50 px-3 py-1 dark:bg-green-900/30">
                <Text className="text-xs font-bold text-green-700 dark:text-green-400">
                  {data?.status}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <Text className="font-medium text-gray-600 dark:text-gray-300">Basic Pay</Text>
              <Text className="font-bold text-gray-900 dark:text-white">
                {currentSalary?.basic_pay}
              </Text>
            </View>
            {auth.user?.role === 'SUPER_ADMIN' && (
              <TouchableOpacity
                onPress={() =>
                  router.push(PAGE_ROUTES.EMPLOYEES.SALARY_HISTORY(data?.id as string))
                }
                className="mt-4 flex-row items-center justify-center">
                <Text className="text-sm font-semibold text-blue-600">View Salary History →</Text>
              </TouchableOpacity>
            )}
          </SectionCard>

          <SectionCard title="Contact Information">
            <InfoRow label="Mobile" value={user?.phone || '-'} icon="📱" />
            <InfoRow label="Email" value={user?.auth.email || '-'} icon="📧" />
          </SectionCard>
        </View>
      </ScrollView>
    </Container>
  );
}
