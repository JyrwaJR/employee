import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from '@/src/components/common/Container';
import { Text } from '@/src/components/ui/text';
import { HistoryCard } from '../../common/HistoryCard';
import { SalarySlip } from '@/src/types/employee';
import { FilterCard } from '../../common/FilterCard';
import { months, years } from '@/src/utils/helper/years';
import { useQuery } from '@tanstack/react-query';
import { PENSION_ENDPOINTS } from '@/src/libs/endpoints/pension';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { http } from '@/src/utils/http';
import { LoadingScreen } from '../../common/LoadingScreen';

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
    queryKey: ['pension', selectedYear, selectedMonth, status],
    queryFn: () => http.get<SalarySlip[]>(PENSION_ENDPOINTS.GET_PENSIONS.replace(':id', empId)),
    select: (data) => data.data,
    enabled: !!empId,
  });

  if (isFetching) return <LoadingScreen />;

  return (
    <>
      <Container className="flex-1 bg-gray-50 dark:bg-slate-950">
        <View className="mt-4 px-4">
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
