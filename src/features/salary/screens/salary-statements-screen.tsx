import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@hooks/use-auth';
import { LoadingScreen } from '@components/screens/loading-screen';
import { http } from '@utils/api/http';
import { SalarySlip } from '@features/employee/types';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { Text } from '@components/ui/text';
import { HistoryCard } from '@components/display/history-card';
import { HeaderStack } from '@components/layout/header';
import { FilterCard } from '@components/display/filter-card';
import { months, years } from '@utils/helpers/years';
import { queryKeys } from '@utils/constants/query-keys';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { toast } from '@components/ui';

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

  const { data, isFetching, isError, error } = useQuery({
    queryKey: queryKeys.salary.statements(id, isTab),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.SALARY.LIST(id)),
    select: (data) => data.data,
    enabled: !!id,
  });

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
              router.push(PAGE_ROUTES.EMPLOYEES.SALARY_PAY_SLIP(item.id));
            }}
          />
        )}
      />
    </Container>
  );
};
