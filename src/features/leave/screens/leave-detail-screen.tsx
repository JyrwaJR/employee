import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Container } from '@components/layout/container';
import { LeaveDetailSkeleton } from '../components/skeleton';
import { EmptyScreen } from '@components/screens';
import { useLeaveDetail } from '../hooks/use-leave-detail';
import { LeaveDetailHeader } from '../components/leave-detail-header';
import { LeaveDetailInfo } from '../components/leave-detail-info';
import { LeaveBalanceCard } from '../components/leave-balance-card';
import { PAGE_ROUTES } from '@utils/constants';
import { LeaveTypeCode } from '../types';
import { Button } from '@components/ui/button';

/**
 * Route search parameters expected by the leave detail screen.
 *
 * All three values are extracted from the URL query string by
 * {@link useLocalSearchParams} and serve as the composite key to
 * identify a single leave record on the backend.
 */
type LeaveDetailSearchParamsT = {
  /** Leave type code (e.g. `SL` for Sick Leave). */
  leave_cd: LeaveTypeCode;
  /** Leave start date in `DD/MM/YYYY` display format. */
  from_dt: string;
  /** Order / approval date in `DD/MM/YYYY` display format. */
  order_dt: string;
};

/**
 * Screen that displays the full details of a single leave request.
 *
 * Reads the leave composite key (`leave_cd`, `from_dt`, `order_dt`)
 * from the route's search params and fetches the corresponding record
 * via {@link useLeaveDetail}.
 *
 * ### States
 *
 * - **Missing params** — If any of the three search params are absent
 *   (e.g. navigated to incorrectly), the screen immediately redirects
 *   back to the leave list via {@link Redirect}.
 * - **Loading** — Shows a {@link LoadingScreen} with a stack header
 *   while the query is in-flight.
 * - **Not found** — If the query completes with no data, renders an
 *   {@link EmptyScreen} with a "refresh" action that re-fetches.
 * - **Success** — Renders the leave header, detail info rows, and
 *   the leave balance card inside a scrollable layout.
 *
 * @example
 * ```tsx
 * // Navigation to this screen (e.g. from a leave list row):
 * router.push(PAGE_ROUTES.LEAVE.DETAILS(leave_cd, from_dt, order_dt));
 * ```
 */
export const LeaveDetailScreen = () => {
  const { leave_cd, from_dt, order_dt } = useLocalSearchParams<LeaveDetailSearchParamsT>();

  const isValidQueries = !!leave_cd && !!from_dt && !!order_dt;

  const { data, isLoading, isFetching, refetch } = useLeaveDetail({ from_dt, leave_cd, order_dt });

  const isLeaveVerified = data?.verify_flg_desc === 'Verified';

  if (!isValidQueries) return <Redirect href={PAGE_ROUTES.LEAVE.INDEX} />;

  if (isLoading || isFetching) return <LeaveDetailSkeleton />;

  if (!data) {
    return (
      <EmptyScreen
        refresh={refetch}
        title="Leave Not Found"
        message="The leave you're looking for doesn't exist"
      />
    );
  }

  return (
    <>
      <Container className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <LeaveDetailHeader leave={data} />
          <LeaveDetailInfo leave={data} />
          <LeaveBalanceCard item={data} />

          {/* Edit button & Verified leave cannot be editet thd */}
          {!isLeaveVerified && (
            <View className="pt-4">
              <Button
                title={data.verify_flg_desc === 'Verified' ? 'Leave Verified' : 'Edit Leave'}
                onPress={() =>
                  router.push(PAGE_ROUTES.LEAVE.UPDATE({ leave_cd, from_dt, order_dt }))
                }
              />
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  );
};
