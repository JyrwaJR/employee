import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Container } from '../../common/Container';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { EMPLOYEE_ENDPOINTS } from '@/src/libs/endpoints/employee';
import { EmployeeT } from '@/src/types/employee';
import { LoadingScreen } from '../../common/LoadingScreen';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { Text } from '../../ui/text';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <View className="flex-row items-center border-b border-gray-100 dark:border-gray-800 py-3 last:border-0">
    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
      <Text className="text-sm">{icon}</Text>
    </View>
    <View>
      <Text variant="subtext" className="text-xs font-medium uppercase">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900 dark:text-white">{value}</Text>
    </View>
  </View>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
    <Text variant="heading" className="mb-4 text-sm text-gray-900 dark:text-white">{title}</Text>
    {children}
  </View>
);

const ActionButton = ({
  label,
  icon,
  onPress,
  primary,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  primary?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mx-1 flex-1 flex-row items-center justify-center rounded-xl py-3',
      primary ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
    )}>
    <Text className="mr-2">{icon}</Text>
    <Text className={cn('font-semibold', primary ? 'text-white' : 'text-gray-900 dark:text-gray-200')}>{label}</Text>
  </TouchableOpacity>
);

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const idx = id.toString() || '';
  const auth = useAuth();

  const { data, isFetching } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => http.get<EmployeeT>(EMPLOYEE_ENDPOINTS.GET_EMPLOYEEE.replace(':id', idx!)),
    select: (data) => data.data,
    enabled: !!id,
  });

  const user = data?.user;

  const currentSalary = data?.current_structure;

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="mb-6 items-center rounded-b-[32px] bg-white dark:bg-gray-900 px-6 pb-6 shadow-sm border-b border-gray-100 dark:border-gray-800">
          <Image
            source={{ uri: `https://i.pravatar.cc/300?u=${user?.first_name}` }}
            className="mb-4 h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 shadow-sm"
          />
          <Text variant="heading" size="2xl" className="text-center text-gray-900 dark:text-white">{user?.first_name}</Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{user?.role}</Text>
          <View className="mt-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">{data?.employee_id}</Text>
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
                <Text className="text-lg font-bold text-gray-900 dark:text-white">{data?.pay_level || '-'}</Text>
              </View>
              <View className="rounded-lg bg-green-50 dark:bg-green-900/30 px-3 py-1">
                <Text className="text-xs font-bold text-green-700 dark:text-green-400">{data?.status}</Text>
              </View>
            </View>
            <View className="flex-row justify-between rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
              <Text className="font-medium text-gray-600 dark:text-gray-300">Basic Pay</Text>
              <Text className="font-bold text-gray-900 dark:text-white">{currentSalary?.basic_pay}</Text>
            </View>
            {auth.user?.role === 'SUPER_ADMIN' && (
              <TouchableOpacity
                onPress={() => router.push(`/employees/${data?.id}/salary`)}
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
