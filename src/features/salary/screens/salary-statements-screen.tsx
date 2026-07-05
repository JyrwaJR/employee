import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { SalaryStatementListItem } from '@components/common/history-card';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { SectionHeader } from '@components/common';
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
        renderItem={({ item }) => <SalaryStatementListItem item={item} />}
      />
    </Container>
  );
};
