import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { router } from 'expo-router';
import { useAuthStore } from '@stores/auth.store';
import { LoadingScreen } from '@components/screens/loading-screen';
import { Text } from '@components/ui/text';
import { HistoryCard } from '@components/display/history-card';
import { FilterCard } from '@components/display/filter-card';
import { months, years } from '@utils/helpers/years';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { toast } from '@components/ui';
import { useSalaryStatement } from '../hooks';

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
  const { emp_cd } = useAuthStore();

  const [selectedYear, setSelectedYear] = useState('2026');

  const [status, setStatus] = useState<string>('PAID');

  const [selectedMonth, setSelectedMonth] = useState<string>('JANUARY');

  const id = idx ? idx : emp_cd || '';

  const { data, isFetching, isError, error } = useSalaryStatement(id, isTab);

  // Handle Query Error
  React.useEffect(() => {
    if (isError) {
      toast.error('Access Error', {
        description: (error as any)?.message || 'Could not retrieve payroll details',
      });
    }
  }, [isError, error]);

  const filteredData =
    data
      ?.filter((item) => item.year.toString() === selectedYear)
      .filter((val) => val.month === selectedMonth)
      .filter((val) => val.status === status) || [];

  if (isFetching) return <LoadingScreen />;

  return (
    <Container>
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
              router.push(PAGE_ROUTES.EMPLOYEES.SALARY_PAY_SLIP(item.id));
            }}
          />
        )}
      />
    </Container>
  );
};
