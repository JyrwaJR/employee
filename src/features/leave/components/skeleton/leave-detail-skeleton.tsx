import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@components/ui/skeleton';
import { Container } from '@components/layout/container';

/**
 * Skeleton placeholder that mimics the {@link LeaveDetailHeader} component.
 *
 * Layout:
 * - Row: large icon (32px equivalent) + status badge (right-aligned)
 * - Leave description title (large text)
 * - Day count subtext
 */
const LeaveDetailHeaderSkeleton = () => (
  <View className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <View className="mb-4 flex-row items-center justify-between">
      <Skeleton className="h-16 w-16 rounded-lg" />
      <Skeleton className="h-7 w-24 rounded-full" />
    </View>
    <Skeleton className="mb-2 h-8 w-52 rounded-md" />
    <Skeleton className="h-4 w-20 rounded" />
  </View>
);

/**
 * Skeleton placeholder that mimics the {@link LeaveDetailInfo} component.
 *
 * Renders a "Leave Details" heading followed by 6 info rows, each
 * with an icon placeholder, label, and value text.
 */
const LeaveDetailInfoSkeleton = () => (
  <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="mb-4 h-5 w-36 rounded-md" />

    {/* 6 InfoRows */}
    {['From', 'To', 'Duration', 'Leave Type', 'Order Date', 'Reason'].map((_, i) => (
      <View key={i} className="mb-4 flex-row items-start">
        <View className="mr-3 mt-0.5 w-6 items-center">
          <Skeleton className="h-5 w-5 rounded" />
        </View>
        <View className="flex-1 gap-y-1">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </View>
      </View>
    ))}

    {/* Reason section */}
    <View className="rounded-md bg-gray-50 p-4 dark:bg-gray-800/50">
      <Skeleton className="mb-2 h-3 w-12 rounded" />
      <Skeleton className="h-3 w-full rounded" />
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics the {@link LeaveBalanceCard} component.
 *
 * Renders a "Leave Balance" heading and a card with icon + text + closing balance.
 */
const LeaveBalanceSkeleton = () => (
  <View className="mt-4">
    <Skeleton className="mb-3 h-5 w-36 rounded-md" />
    <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <View className="gap-y-1.5">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </View>
        </View>
        <Skeleton className="h-6 w-10 rounded" />
      </View>
    </View>
  </View>
);

/**
 * Skeleton loading state for the leave detail screen.
 *
 * Renders three stacked skeleton cards that mirror the detail screen layout:
 * `LeaveDetailHeader` → `LeaveDetailInfo` → `LeaveBalanceCard`.
 *
 * The `StackHeader` is NOT included here — it is rendered separately by the
 * screen so that the back button persists during loading.
 *
 * @example
 * ```tsx
 * <>
 *   <StackHeader />
 *   <LeaveDetailSkeleton />
 * </>
 * ```
 */
export const LeaveDetailSkeleton = () => (
  <Container className="flex-1">
    <View>
      {/* Header card skeleton */}
      <View className="mt-4">
        <LeaveDetailHeaderSkeleton />
      </View>

      {/* Info card skeleton */}
      <View className="mt-4">
        <LeaveDetailInfoSkeleton />
      </View>

      {/* Balance card skeleton */}
      <LeaveBalanceSkeleton />
    </View>
  </Container>
);
