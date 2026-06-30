import React from 'react';
import { ScrollView } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Container } from '@components/layout/container';
import { LoadingScreen } from '@components/screens/loading-screen';
import { EmptyScreen } from '@components/screens';
import { useLeaveDetail } from '../hooks/use-leave-detail';
import { LeaveDetailHeader } from '../components/leave-detail-header';
import { LeaveDetailInfo } from '../components/leave-detail-info';
import { LeaveBalanceCard } from '../components/leave-balance-card';
import { StackHeader } from '@components/layout';
import { PAGE_ROUTES } from '@utils/constants';

/**
 * Route search parameters expected by the leave detail screen.
 *
 * All three values are extracted from the URL query string by
 * {@link useLocalSearchParams} and serve as the composite key to
 * identify a single leave record on the backend.
 */
type SearchParamsT = {
  /** Leave type code (e.g. `SL` for Sick Leave). */
  leave_cd: string;
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
  const { leave_cd, from_dt, order_dt } = useLocalSearchParams<SearchParamsT>();
  const isValidQuery = leave_cd && from_dt && order_dt;

  const { data, isLoading, refetch } = useLeaveDetail({ from_dt, leave_cd, order_dt });

  if (!isValidQuery) return <Redirect href={PAGE_ROUTES.LEAVE.INDEX} />;

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
          <LeaveBalanceCard balance={data} />
        </ScrollView>
      </Container>
    </>
  );
};
