import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { EmptyScreen } from '@components/screens';
import { useLeaveDetail } from '../hooks/use-leave-detail';
import { LeaveDetailHeader } from '../components/leave-detail-header';
import { LeaveDetailInfo } from '../components/leave-detail-info';
import { LeaveBalanceCard } from '../components/leave-balance-card';
import { StackHeader } from '@components/layout';

type SearchParamsT = {
  leave_cd: string;
  from_dt: string;
  order_dt: string;
};

export const LeaveDetailScreen = () => {
  const { leave_cd, from_dt, order_dt } = useLocalSearchParams<SearchParamsT>();

  const { data, isLoading, refetch } = useLeaveDetail({ from_dt, leave_cd, order_dt });

  if (isLoading)
    return (
      <>
        <StackHeader />
        <LoadingScreen />
      </>
    );

  if (!data) {
    return (
      <>
        <StackHeader />
        <EmptyScreen
          refresh={refetch}
          title="Leave Not Found"
          message="The leave you're looking for doesn't exist"
        />
      </>
    );
  }

  return (
    <>
      <StackHeader />
      <Container className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <LeaveDetailHeader leave={data} />
          <LeaveDetailInfo leave={data} />
          <LeaveBalanceCard balance={data.leave_bal} />
        </ScrollView>
      </Container>
    </>
  );
};
