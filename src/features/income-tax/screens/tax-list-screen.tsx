import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { router } from 'expo-router';
import { useEmployeeTaxes } from '../hooks';
import { TaxSummaryCard } from '../components';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { LoadingScreen } from '@components/screens/loading-screen';

export default function TaxListScreen() {
  const { data: taxList, isLoading, isFetching, refetch } = useEmployeeTaxes();

  if (isLoading) return <LoadingScreen />;

  if (!taxList || taxList.length === 0) {
    return (
      <EmptyScreen
        title="No Tax Records Found"
        message="Tax data is not yet available for any employee."
        refresh={refetch}
      />
    );
  }

  return (
    <Container className="flex-1">
      <FlatList
        data={taxList}
        keyExtractor={(item) => item.employeeId}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TaxSummaryCard item={item} onPress={() => router.push(PAGE_ROUTES.TAX.DETAIL)} />
        )}
      />
    </Container>
  );
}
