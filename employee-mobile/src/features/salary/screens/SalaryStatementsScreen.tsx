import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@/src/shared/components/layout/Container';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { LoadingScreen } from '@/src/shared/components/screens/LoadingScreen';
import { http } from '@/src/shared/utils/http';
import { SalarySlip } from '@/src/features/employee/types';
import { api } from '@/src/shared/api';
import { Text } from '@/src/shared/components/ui/text';
import { HistoryCard } from '@/src/shared/components/display/HistoryCard';
import { HeaderStack } from '@/src/shared/components/layout/Header';
import { FilterCard } from '@/src/shared/components/display/FilterCard';
import { months, years } from '@/src/shared/utils/helper/years';
import { queryKeys } from '@/src/shared/api/query-keys';
import { routes } from '@/src/shared/constants/routes';

type Props = {
  idx?: string;
  isTab?: boolean;
};

const statusOptions = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Paid',
    value: 'PAID',
  },
];

export const StatementScreen = ({ idx, isTab }: Props) => {
  const { user } = useAuth();

  const [selectedYear, setSelectedYear] = useState('2026');

  const [status, setStatus] = useState<string>('PAID');

  const [selectedMonth, setSelectedMonth] = useState<string>('JANUARY');

  const id = idx ? idx : user?.employee_id || '';

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.salary.statements(id, isTab),
    queryFn: () => http.get<SalarySlip[]>(api.salary.list(id)),
    select: (data) => data.data,
    enabled: !!id,
  });

  const filteredData =
    data
      ?.filter((item) => item.year.toString() === selectedYear)
      .filter((val) => val.month === selectedMonth)
      .filter((val) => val.status === status) || [];

  if (isFetching) return <LoadingScreen />;

  return (
    <Container>
      {!isTab && <HeaderStack title="Statements" />}
      {/* Header */}

      <View className="mt-4 bg-transparent p-4">
        <FilterCard
          year={selectedYear}
          years={years}
          onYearChange={(value) => setSelectedYear(value)}
          month={selectedMonth}
          months={months}
          onMonthChange={(value) => setSelectedMonth(value)}
          status={status}
          onStatusChange={(value) => setStatus(value)}
          statusOptions={statusOptions}
        />
      </View>

      {/* Content */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
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
              router.push(routes.employees.salaryPayslip(item.id));
            }}
          />
        )}
      />
    </Container>
  );
};
