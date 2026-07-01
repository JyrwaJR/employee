import React from 'react';
import { FlatList } from 'react-native';
import { router } from 'expo-router';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { LeaveCard } from '../components/leave-card';
import { useLeaves } from '@hooks/use-leaves';
import { SectionHeader } from '@components/base/section-header';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { FAB } from '@components/fab';
import { useDoubleBackExit } from '@hooks';

export const LeaveScreen = () => {
  const { data: leaves, isFetching, refetch } = useLeaves();
  useDoubleBackExit({ rootRoutes: ['/', '/leaves'] });

  if (isFetching) {
    return (
      <>
        <LoadingScreen />
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
        renderItem={({ item }) => <LeaveCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
      <FAB icon="add" onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)} />
    </Container>
  );
};
