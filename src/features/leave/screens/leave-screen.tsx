import React from 'react';
import { View, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { LeaveCard } from '../components/leave-card';
import { useLeaves } from '../hooks';
import { SectionHeader } from '@components/base/section-header';
import { StackHeader } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants/routes';

export const LeaveScreen = () => {
  const { data: leaves, isFetching, refetch } = useLeaves();

  if (isFetching)
    return (
      <>
        <SectionHeader variant="splash" title="My Leaves" />
        <LoadingScreen />
      </>
    );

  if (!leaves) {
    return (
      <>
        <StackHeader />
        <EmptyScreen
          title="No Leaves Found"
          message="You have not applied for any leaves yet"
          refresh={refetch}
        />
      </>
    );
  }

  return (
    <Container className="flex-1">
      <View className="mt-4 px-4">
        <SectionHeader title="My Leaves" />
      </View>

      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaveCard item={item} onPress={() => router.push(PAGE_ROUTES.LEAVE.DETAILS(item.id))} />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};
