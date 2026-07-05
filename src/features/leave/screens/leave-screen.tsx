import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Container } from '@components/layout/container';
import { LeaveListSkeleton } from '../components/skeleton';
import { LeaveCard } from '../components/leave-card';
import { useLeaves } from '@hooks/use-leaves';
import { SectionHeader } from '@components/common/section-header';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { FAB } from '@components/common';

export const LeaveScreen = () => {
  const { data: leaves, isLoading, isFetching, refetch } = useLeaves();

  if (isLoading) {
    return (
      <>
        <LeaveListSkeleton />
        <FAB icon="add" onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)} />
      </>
    );
  }

  if (!leaves || leaves.length === 0) {
    return (
      <>
        <EmptyScreen
          title="No Leaves Found"
          message="You have not applied for any leaves yet"
          refresh={refetch}
        />
        <FAB icon="add" onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)} />
      </>
    );
  }

  return (
    <Container className="flex-1">
      <SectionHeader title="My Leaves" />

      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        renderItem={({ item }) => <LeaveCard item={item} />}
        contentContainerClassName="pb-20"
        showsVerticalScrollIndicator={false}
      />
      <FAB icon="add" onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)} />
    </Container>
  );
};
