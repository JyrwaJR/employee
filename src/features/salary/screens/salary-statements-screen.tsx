import React from 'react';
import { FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { router } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { HistoryCard } from '@components/display/history-card';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useSalaryStatements } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { SectionHeader } from '@components/base';

export const StatementScreen = () => {
  const { data: statements, isFetching } = useSalaryStatements();

  if (isFetching) return <LoadingScreen />;

  return (
    <Container>
      <SectionHeader title="Salary Statements" />
      {/* Content */}
      <FlatList
        data={statements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyScreen
            title="No Statements Found"
            message="You have not created any statements yet"
          />
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
