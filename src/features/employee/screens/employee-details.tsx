import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Container } from '@components/layout/container';
import { router, useLocalSearchParams } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { useAuthStore } from '@stores/auth.store';
import { Text } from '@components/ui/text';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { toast } from '@components/ui';
import { useEmployee } from '../hooks/use-employee';
import { InfoRow } from '../components/info-row';
import { SectionCard } from '../components/section-card';
import { ActionButton } from '../components/action-button';

/**
 * Employee detail screen displaying full profile information from the `UserT` object
 * returned by `useEmployee`. Renders a profile header (avatar, full name, designation,
 * employee code), quick actions (call, email), official details (department, office
 * location, date of joining), financial overview (pay scale, status, basic pay), and
 * contact information. Shows a "View Salary History" link for `SUPER_ADMIN` users only.
 * Handles loading, error, and null-data states gracefully.
 */
export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const idx = id.toString() || '';
  const auth = useAuthStore();

  const { data, isFetching, isError, error } = useEmployee({ emp_cd: idx });

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

  const user = data;

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="mb-6 items-center rounded-b-[32px] border-b border-gray-100 bg-white px-6 pb-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Image
            source={{ uri: `https://i.pravatar.cc/300?u=${user?.emp_fname}` }}
            className="mb-4 h-24 w-24 rounded-full border-4 border-white bg-gray-200 shadow-sm dark:border-gray-800"
          />
          <Text variant="heading" size="2xl" className="text-center text-gray-900 dark:text-white">
            {[user?.emp_fname, user?.emp_mname, user?.emp_lname].filter(Boolean).join(' ')}
          </Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{data?.emp_designation}</Text>
          <View className="mt-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">{idx}</Text>
          </View>

          {/* Quick Actions */}
          <View className="mt-6 w-full flex-row">
            <ActionButton
              label="Call"
              icon="📞"
              onPress={() => Linking.openURL(`tel:${user?.emp_phone}`)}
            />
            <ActionButton
              label="Email"
              icon="✉️"
              onPress={() => Linking.openURL(`mailto:${user?.emp_email}`)}
              primary
            />
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-10">
          <SectionCard title="Official Details">
            <InfoRow label="Department" value={data?.emp_dept ?? ''} icon="🏢" />
            <InfoRow label="Office Location" value={data?.office_name ?? ''} icon="📍" />
            <InfoRow label="Date of Joining" value={data?.emp_date_of_joining || ''} icon="📅" />
          </SectionCard>

          <SectionCard title="Financial Overview">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-medium uppercase text-gray-400">
                  Current Pay Level
                </Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {data?.pay_scale || '-'}
                </Text>
              </View>
              <View className="rounded-lg bg-green-50 px-3 py-1 dark:bg-green-900/30">
                <Text className="text-xs font-bold text-green-700 dark:text-green-400">
                  {data?.emp_status}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <Text className="font-medium text-gray-600 dark:text-gray-300">Basic Pay</Text>
              <Text className="font-bold text-gray-900 dark:text-white">{user?.basic_pay}</Text>
            </View>
            {auth.role === 'SUPER_ADMIN' && (
              <TouchableOpacity
                onPress={() => router.push(PAGE_ROUTES.EMPLOYEES.SALARY_HISTORY(idx))}
                className="mt-4 flex-row items-center justify-center">
                <Text className="text-sm font-semibold text-blue-600">View Salary History →</Text>
              </TouchableOpacity>
            )}
          </SectionCard>

          <SectionCard title="Contact Information">
            <InfoRow label="Mobile" value={user?.emp_phone || '-'} icon="📱" />
            <InfoRow label="Email" value={user?.emp_email || '-'} icon="📧" />
          </SectionCard>
        </View>
      </ScrollView>
    </Container>
  );
}
