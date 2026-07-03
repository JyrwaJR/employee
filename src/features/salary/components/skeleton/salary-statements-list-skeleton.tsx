import React from 'react';
import { FlatList, View } from 'react-native';
import { Skeleton } from '@components/ui/skeleton';
import { Container } from '@components/layout/container';

/**
 * A single skeleton card that mimics the {@link HistoryCard} layout used
 * in the salary statements list.
 *
 * Renders placeholder blocks for:
 * - Document icon (rounded square with blue tint)
 * - Month/year title + credited-on subtext
 * - Chevron icon (right-aligned)
 * - Divider line
 * - Net pay label + amount
 * - Status badge (pill shape) + "Salary Slip" subtext
 */
const HistoryCardSkeleton = () => (
  <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
    {/* Row 1: Icon + Title + Chevron */}
    <View className="mb-2 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <View className="gap-y-1.5">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3 w-28 rounded" />
        </View>
      </View>
      <Skeleton className="h-5 w-5 rounded" />
    </View>

    {/* Divider */}
    <View className="my-2 h-[1px] bg-gray-100 dark:bg-gray-800" />

    {/* Row 2: Net Pay + Status */}
    <View className="mt-1 flex-row items-center justify-between">
      <View className="gap-y-1">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-5 w-24 rounded" />
      </View>
      <View className="items-end gap-y-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-16 rounded" />
      </View>
    </View>
  </View>
);

interface SalaryStatementsListSkeletonProps {
  /** Number of skeleton cards to render. Defaults to 6. */
  count?: number;
}

/**
 * Skeleton loading state for the salary statements list screen.
 *
 * Renders a `Container` with a `SectionHeader` placeholder and `count`
 * skeleton cards that mirror the `HistoryCard` layout used in the salary
 * statements list. Replaces the generic `LoadingScreen` when salary
 * statement data is being fetched.
 *
 * @example
 * ```tsx
 * <SalaryStatementsListSkeleton count={5} />
 * ```
 */
export const SalaryStatementsListSkeleton = ({ count = 6 }: SalaryStatementsListSkeletonProps) => (
  <Container className="flex-1">
    {/* SectionHeader placeholder */}
    <View className="mb-7">
      <Skeleton className="mb-2 h-7 w-40 rounded-md" />
      <Skeleton className="h-4 w-52 rounded" />
    </View>

    {/* Skeleton cards */}
    <FlatList
      contentContainerClassName="pb-20"
      data={Array.from({ length: count })}
      renderItem={() => <HistoryCardSkeleton />}
    />
  </Container>
);
