import React from 'react';
import { View, FlatList } from 'react-native';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { LeaveCard } from '../components/leave-card';
import { useLeaves } from '../hooks';
import { SectionHeader } from '@components/base/section-header';
import { StackHeader } from '@components/layout';
import { EmptyScreen } from '@components/screens';

export const LeaveScreen = () => {
  const { data, isFetching, refetch } = useLeaves();

  const leaves = data?.emp_leave_data ?? [];

  if (isFetching)
    return (
      <>
        <SectionHeader variant="splash" title="My Leaves" />
        <LoadingScreen />
      </>
    );

  if (!data) {
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
        keyExtractor={(item) => item.from_dt + item.to_dt}
        renderItem={({ item }) => <LeaveCard item={item} onPress={() => {}} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};
