import React from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { HistoryCard } from '@components/display/history-card';
import { SalarySlip } from '@features/employee/types';
import { FilterCard } from '@components/display/filter-card';
import { months, years } from '@utils/helpers/years';
import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { useAuth } from '@hooks/use-auth';
import { http } from '@utils/api/http';
import { LoadingScreen } from '@components/screens/loading-screen';
import { queryKeys } from '@utils/constants/query-keys';

const statusOptions = [
  { label: 'Paid', value: 'PAID' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Pending', value: 'PENDING' },
];

const PensionScreen = () => {
  const [selectedYear, setSelectedYear] = React.useState('2025');
  const [selectedMonth, setSelectedMonth] = React.useState('JANUARY');
  const [status, setStatus] = React.useState('PAID');
  const { user } = useAuth();
  const empId = user?.employee_id || '';

  const { data: PENSION_DATA, isFetching } = useQuery({
    queryKey: queryKeys.pension.list(empId, selectedYear, selectedMonth, status),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.PENSION.LIST(empId)),
    select: (data) => data.data,
    enabled: !!empId,
  });

  if (isFetching) return <LoadingScreen />;

  return (
    <>
      <Container className="flex-1">
        <View className="mt-4 p-4">
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

        <FlatList
          data={PENSION_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard onPress={() => {}} item={item} />}
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
        />
      </Container>
    </>
  );
};

export default PensionScreen;
