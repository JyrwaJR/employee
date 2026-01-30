import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
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
import { AUTH_ENDPOINTS } from '@/src/libs/endpoints/auth';
import { EMPLOYEE_ENDPOINTS } from '@/src/libs/endpoints/employee';
import { EmployeeT } from '@/src/types/employee';
import { LoadingScreen } from '../../common/LoadingScreen';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <View className="flex-row items-center border-b border-gray-50 py-3 last:border-0">
    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-50">
      <Text className="text-sm">{icon}</Text>
    </View>
    <View>
      <Text className="text-xs font-medium uppercase text-gray-400">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </View>
  </View>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <Text className="mb-4 text-sm font-bold text-gray-900">{title}</Text>
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
      primary ? 'bg-gray-900' : 'bg-gray-100'
    )}>
    <Text className="mr-2">{icon}</Text>
    <Text className={cn('font-semibold', primary ? 'text-white' : 'text-gray-900')}>{label}</Text>
  </TouchableOpacity>
);

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const idx = id.toString() || '';

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
        <View className="mb-6 items-center rounded-b-[32px] bg-white px-6 pb-6 shadow-sm">
          <Image
            source={{ uri: `https://i.pravatar.cc/300?u=${user?.first_name}` }}
            className="mb-4 h-24 w-24 rounded-full border-4 border-white bg-gray-200 shadow-sm"
          />
          <Text className="text-center text-2xl font-bold text-gray-900">{user?.first_name}</Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{user?.role}</Text>
          <View className="mt-2 rounded-full bg-gray-100 px-3 py-1">
            <Text className="text-xs font-medium text-gray-500">{data?.employee_id}</Text>
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
                <Text className="text-lg font-bold text-gray-900">{data?.pay_level || '-'}</Text>
              </View>
              <View className="rounded-lg bg-green-50 px-3 py-1">
                <Text className="text-xs font-bold text-green-700">{data?.status}</Text>
              </View>
            </View>
            <View className="flex-row justify-between rounded-xl bg-gray-50 p-3">
              <Text className="font-medium text-gray-600">Basic Pay</Text>
              <Text className="font-bold text-gray-900">{currentSalary?.basic_pay}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/employees/${data?.id}/salary`)}
              className="mt-4 flex-row items-center justify-center">
              <Text className="text-sm font-semibold text-blue-600">View Salary History →</Text>
            </TouchableOpacity>
          </SectionCard>

          <SectionCard title="Contact Information">
            <InfoRow label="Mobile" value={user?.phone || ''} icon="📱" />
            <InfoRow label="Email" value={user?.email || ''} icon="📧" />
          </SectionCard>
        </View>
      </ScrollView>
    </Container>
  );
}
