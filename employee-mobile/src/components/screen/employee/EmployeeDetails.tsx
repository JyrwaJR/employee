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

// --- Screen ---

export default function EmployeeDetailScreen({
  route,
  navigation,
}: {
  route?: any;
  navigation?: any;
}) {
  // In a real app, fetch data based on route.params.id
  const EMP = {
    name: 'Amit Sharma',
    role: 'Senior Technical Officer',
    id: 'GOV-2023-1001',
    dept: 'Ministry of Electronics & IT',
    location: 'CGO Complex, New Delhi',
    email: 'amit@nic.in',
    phone: '+91 98765 43210',
    joinDate: '15 June 2015',
    payLevel: 'Level 11 (Cell 4)',
    basicPay: '₹73,900',
    avatar: 'https://i.pravatar.cc/300?u=1',
  };

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="mb-6 items-center rounded-b-[32px] bg-white px-6 pb-6 shadow-sm">
          <Image
            source={{ uri: EMP.avatar }}
            className="mb-4 h-24 w-24 rounded-full border-4 border-white bg-gray-200 shadow-sm"
          />
          <Text className="text-center text-2xl font-bold text-gray-900">{EMP.name}</Text>
          <Text className="mb-1 text-sm font-medium text-blue-600">{EMP.role}</Text>
          <View className="mt-2 rounded-full bg-gray-100 px-3 py-1">
            <Text className="text-xs font-medium text-gray-500">{EMP.id}</Text>
          </View>

          {/* Quick Actions */}
          <View className="mt-6 w-full flex-row">
            <ActionButton
              label="Call"
              icon="📞"
              onPress={() => Linking.openURL(`tel:${EMP.phone}`)}
            />
            <ActionButton
              label="Email"
              icon="✉️"
              onPress={() => Linking.openURL(`mailto:${EMP.email}`)}
              primary
            />
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-10">
          <SectionCard title="Official Details">
            <InfoRow label="Department" value={EMP.dept} icon="🏢" />
            <InfoRow label="Office Location" value={EMP.location} icon="📍" />
            <InfoRow label="Date of Joining" value={EMP.joinDate} icon="📅" />
          </SectionCard>

          <SectionCard title="Financial Overview">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-medium uppercase text-gray-400">
                  Current Pay Level
                </Text>
                <Text className="text-lg font-bold text-gray-900">{EMP.payLevel}</Text>
              </View>
              <View className="rounded-lg bg-green-50 px-3 py-1">
                <Text className="text-xs font-bold text-green-700">ACTIVE</Text>
              </View>
            </View>
            <View className="flex-row justify-between rounded-xl bg-gray-50 p-3">
              <Text className="font-medium text-gray-600">Basic Pay</Text>
              <Text className="font-bold text-gray-900">{EMP.basicPay}</Text>
            </View>
            <TouchableOpacity className="mt-4 flex-row items-center justify-center">
              <Text className="text-sm font-semibold text-blue-600">View Salary History →</Text>
            </TouchableOpacity>
          </SectionCard>

          <SectionCard title="Contact Information">
            <InfoRow label="Mobile" value={EMP.phone} icon="📱" />
            <InfoRow label="Email" value={EMP.email} icon="📧" />
          </SectionCard>
        </View>
      </ScrollView>
    </Container>
  );
}
