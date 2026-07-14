import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { FilterCard, SalaryStatementListItem, SectionHeader } from '@components/common';
import { SalaryStatementsListSkeleton } from '../components/skeleton';
import { months, years } from '@utils/helpers';

export const StatementScreen = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('JAN');
  const {
    data: statements,
    isLoading,
    isFetching,
    refetch,
  } = useSalaryStatements({
    month: selectedMonth,
    year: parseInt(selectedYear),
  });

  if (isLoading) {
    return <SalaryStatementsListSkeleton />;
  }

  if (!statements) {
    return (
      <>
        <View className="p-4">
          <FilterCard
            year={selectedYear}
            years={years}
            onYearChange={(value) => setSelectedYear(value)}
            month={selectedMonth}
            months={months}
            onMonthChange={(value) => setSelectedMonth(value)}
            isOpen
          />
        </View>
        <EmptyScreen title="No salary satement found" refresh={refetch} />
      </>
    );
  }

  return (
    <Container className="flex-1">
      <SectionHeader title="Salary Statements" />
      <View className="p-4">
        <FilterCard
          year={selectedYear}
          years={years}
          onYearChange={(value) => setSelectedYear(value)}
          month={selectedMonth}
          months={months}
          onMonthChange={(value) => setSelectedMonth(value)}
          isOpen
        />
      </View>
      <FlatList
        data={[statements]}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => <SalaryStatementListItem item={item} />}
        ListEmptyComponent={
          <EmptyScreen
            title="No Statements Found"
            message="You have not created any statements yet"
            refresh={refetch}
          />
        }
      />
    </Container>
  );
};
