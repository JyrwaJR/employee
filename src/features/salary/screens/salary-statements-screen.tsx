import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { router } from 'expo-router';
import { HistoryCard } from '@components/display/history-card';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { SectionHeader } from '@components/base';
import { SalaryStatementsListSkeleton } from '../components/skeleton';

export const StatementScreen = () => {
  const { data: statements, isLoading, isFetching, refetch } = useSalaryStatements();

  if (isLoading) {
    return <SalaryStatementsListSkeleton />;
  }

  if (!statements || statements.length === 0) {
    return (
      <EmptyScreen
        title="No Statements Found"
        message="You have not created any statements yet"
        refresh={refetch}
      />
    );
  }

  return (
    <Container className="flex-1">
      <SectionHeader title="Salary Statements" />

      <FlatList
        data={statements}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
