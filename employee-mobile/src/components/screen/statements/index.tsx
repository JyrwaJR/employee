import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Container } from '../../common/Container';
import { router, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { LoadingScreen } from '../../common/LoadingScreen';
import { http } from '@/src/utils/http';
import { SalarySlip } from '@/src/types/employee';
import { SALARY_ENDPOINTS } from '@/src/libs/endpoints/salary';
import { ModernButton } from '../../ui/button';
import { Text } from '../../ui/text';
import { useThemeStore } from '@/src/store/theme';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data: History of Payslips ---
// Simulating slight variations due to DA hikes or leave deductions
const SALARY_HISTORY = [
  { id: '1', month: 'January', year: '2026', amount: 68232, status: 'Paid', date: '31 Jan' },
  { id: '2', month: 'December', year: '2025', amount: 68232, status: 'Paid', date: '31 Dec' },
  { id: '3', month: 'November', year: '2025', amount: 68232, status: 'Paid', date: '30 Nov' },
  { id: '4', month: 'October', year: '2025', amount: 65400, status: 'Paid', date: '31 Oct' }, // Pre-increment
  { id: '5', month: 'September', year: '2025', amount: 65400, status: 'Paid', date: '30 Sep' },
  { id: '6', month: 'August', year: '2025', amount: 65400, status: 'Paid', date: '31 Aug' },
  { id: '7', month: 'July', year: '2025', amount: 62100, status: 'Paid', date: '31 Jul' }, // DA Hike month
  { id: '8', month: 'June', year: '2025', amount: 60500, status: 'Paid', date: '30 Jun' },
];

// --- Components ---

const YearFilter = ({
  selected,
  year,
  onPress,
}: {
  selected: boolean;
  year: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mr-3 rounded-full border px-5 py-2',
      selected ? 'border-blue-600 bg-blue-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    )}>
    <Text className={cn('text-sm font-semibold', selected ? 'text-white' : 'text-gray-600 dark:text-gray-300')}>
      {year}
    </Text>
  </TouchableOpacity>
);

const HistoryCard = ({ item, onPress }: { item: SalarySlip; onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
    {/* Left: Icon & Date */}
    <View className="flex-row items-center">
      <View
        className={cn(
          'mr-4 h-12 w-12 items-center justify-center rounded-xl',
          item.status === 'PAID' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
        )}>
        <Text className="text-xl">{item.status === 'PAID' ? '📄' : '⏳'}</Text>
      </View>

      <View>
        <Text className="text-base font-bold text-gray-900 dark:text-white">{item.month}</Text>
        <Text variant="subtext" className="text-xs font-medium">Credited on {item.created_at}</Text>
      </View>
    </View>

    {/* Right: Amount & Arrow */}
    <View className="items-end">
      <Text className="text-base font-bold text-gray-900 dark:text-white">₹{item.total_earnings}</Text>
      <View className="mt-1 flex-row items-center">
        <View
          className={cn(
            'mr-1.5 h-2 w-2 rounded-full',
            item.status === 'PAID' ? 'bg-green-500' : 'bg-orange-400'
          )}
        />
        <Text className="text-xs font-medium text-gray-400">{item.status}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

type Props = {
  idx?: string;
  isTab?: boolean;
};

export const StatementScreen = ({ idx, isTab }: Props) => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2026');
  const { theme } = useThemeStore();

  const id = idx ? idx : user?.employee_id || '';

  const { data, isFetching } = useQuery({
    queryKey: ['employee salary', id, isTab],
    queryFn: () => http.get<SalarySlip[]>(SALARY_ENDPOINTS.GET_EMPLOYEEE_SALARY.replace(':id', id)),
    select: (data) => data.data,
    enabled: !!id,
  });

  const filteredData = data?.filter((item) => item.year.toString() === selectedYear) || [];

  if (isFetching) return <LoadingScreen />;

  return (
    <Container className="flex-1">
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {!isTab && (
        <Stack.Screen
          options={{
            title: 'History',
            headerBackButtonDisplayMode: 'generic',
            headerShown: true,
          }}
        />
      )}
      {/* Header */}
      <View className="z-10 rounded-b-[32px] bg-white dark:bg-gray-900 px-6 pb-6 pt-2 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text variant="subtext" className="mb-1 text-sm font-medium">Financial Records</Text>
            <Text variant="heading" size="2xl" className="text-gray-900 dark:text-white">My Payslips</Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Text>📥</Text>
          </TouchableOpacity>
        </View>

        {/* Year Selector */}
        <View className="flex-row">
          {['2026', '2025', '2024'].map((year) => (
            <YearFilter
              key={year}
              year={year}
              selected={selectedYear === year}
              onPress={() => setSelectedYear(year)}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <Text className="mb-4 text-4xl">📂</Text>
            <Text variant="subtext" className="text-center font-medium">
              No records found for {selectedYear}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() => {
              router.push(`/employees/salary/${item.id}`);
            }}
          />
        )}
      />

      {/* Summary Widget (Bottom) */}
      <View className="absolute bottom-2 left-6 right-6 flex-row items-center justify-between rounded-2xl bg-blue-600 dark:bg-blue-700 p-4 shadow-lg shadow-blue-600/30">
        <View>
          <Text className="text-xs font-medium uppercase tracking-wider text-blue-100">
            YTD Earnings ({selectedYear})
          </Text>
          <Text className="text-lg font-bold text-white">
            {data?.reduce((acc, item) => acc + parseInt(item.total_earnings), 0)}
          </Text>
        </View>
        <TouchableOpacity className="rounded-lg bg-white/10 px-4 py-2">
          <Text className="text-xs font-bold text-white">Form-16</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};
