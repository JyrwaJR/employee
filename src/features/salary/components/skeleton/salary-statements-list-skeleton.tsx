import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@components/ui/skeleton';
import { SectionHeaderSkeleton } from '@components/skeleton/section-header';
import { Container } from '@components/layout/container';

/** A skeleton card block used for each section of the salary statement. */
const SectionCardSkeleton = ({ rows = 2 }: { rows?: number }) => (
  <View className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
    <Skeleton className="mb-4 h-3 w-28 rounded" />
    {Array.from({ length: rows }).map((_, i) => (
      <View key={i} className="mb-3 flex-row items-center justify-between">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </View>
    ))}
  </View>
);

/** A skeleton card for the salary items table with multiple item rows. */
const SalaryItemsCardSkeleton = () => (
  <View className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
    <Skeleton className="mb-4 h-3 w-28 rounded" />
    {Array.from({ length: 4 }).map((_, i) => (
      <View key={i} className="mb-3 flex-row items-center justify-between">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </View>
    ))}
  </View>
);

interface SalaryStatementsListSkeletonProps {
  /** No longer used — kept for backward compatibility. */
  count?: number;
}

/**
 * Skeleton loading state for the salary statements screen.
 *
 * Renders a `Container` with a `SectionHeader` placeholder and
 * skeleton cards that mirror the sectioned layout (GPF Information,
 * Bank & Voucher Details, Salary Breakdown, Totals).
 */
export const SalaryStatementsListSkeleton = ({}: SalaryStatementsListSkeletonProps) => (
  <Container className="flex-1">
    <SectionHeaderSkeleton hasSubtitle titleWidth="w-40" subtitleWidth="w-52" />

    {/* Filter card placeholder */}
    <View className="mb-4 rounded-2xl border border-gray-100 dark:border-gray-800">
      <View className="flex-row items-center justify-between rounded-t-2xl bg-gray-50/50 p-4 dark:bg-white/5">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-5 w-5 rounded" />
      </View>
      <View className="px-4 pb-4 pt-2">
        <Skeleton className="mb-2 h-3 w-8 rounded" />
        <View className="flex-row gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </View>
        <Skeleton className="mb-2 mt-4 h-3 w-10 rounded" />
        <View className="flex-row gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </View>
      </View>
    </View>

    {/* Statement detail content skeleton */}
    <View>
      <SectionCardSkeleton rows={5} />
      <SectionCardSkeleton rows={2} />
      <SectionCardSkeleton rows={3} />
      <SalaryItemsCardSkeleton />
      <SectionCardSkeleton rows={3} />
    </View>
  </Container>
);
