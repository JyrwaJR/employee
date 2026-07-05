import React from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { SalaryStatementListItem } from '@components/common/history-card';
import { FilterCard } from '@components/common/filter-card';
import { months, years } from '@utils/helpers/years';
import { LoadingScreen } from '@components/screens/loading-screen';
import { usePensions } from '../hooks';
import { SectionHeader } from '@components/common/section-header';

const statusOptions = [
  { label: 'Paid', value: 'PAID' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Pending', value: 'PENDING' },
];

const PensionScreen = () => {
  const [selectedYear, setSelectedYear] = React.useState('2026');
  const [selectedMonth, setSelectedMonth] = React.useState('JANUARY');
  const [status, setStatus] = React.useState('PAID');

  const { data: PENSION_DATA, isFetching } = usePensions(selectedYear, selectedMonth, status);

  if (isFetching)
    return (
      <>
        <SectionHeader variant="section" title="Pension History" />
        <LoadingScreen />
      </>
    );

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
          renderItem={({ item }) => <SalaryStatementListItem item={item} />}
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
