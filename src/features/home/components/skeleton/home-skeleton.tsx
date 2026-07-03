import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { Skeleton } from '@components/ui/skeleton';

/**
 * Skeleton placeholder that mimics the {@link HomeHeader} component.
 *
 * Renders the section-header shape with a blue accent bar on the left,
 * a large title placeholder for the user's name, and a smaller subtitle
 * for the greeting text.
 */
const HomeHeaderSkeleton = () => (
  <View className="mb-7">
    <View className="flex-row items-center gap-x-4">
      {/* Accent bar */}
      <Skeleton className="h-10 w-[3px] rounded-full" />
      {/* Title + subtitle */}
      <View className="flex-1 gap-y-2">
        <Skeleton className="h-7 w-48 rounded-md" />
        <Skeleton className="h-4 w-36 rounded" />
      </View>
    </View>
    {/* Separator */}
    <View className="ml-[23px] mt-4 h-[2px] rounded-full bg-gray-100 dark:bg-gray-800" />
  </View>
);

/**
 * Skeleton placeholder that mimics the {@link HomeQuickActions} component.
 *
 * Renders a "Quick Actions" heading and four circular action-icon
 * placeholders arranged in a horizontal row.
 */
const QuickActionsSkeleton = () => (
  <View className="mx-6">
    <Skeleton className="mb-4 h-5 w-32 rounded-md" />
    <View className="flex-row justify-between">
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} className="items-center gap-y-2">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-3 w-16 rounded" />
        </View>
      ))}
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics an {@link HomeActiveLeaveCard}.
 *
 * Renders a card shape with an icon + "Active Leave" title on the left,
 * a status badge on the right, and leave description + date range below.
 */
const ActiveLeaveCardSkeleton = () => (
  <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    {/* Header row: icon + title + badge */}
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-x-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </View>
      <Skeleton className="h-6 w-20 rounded-full" />
    </View>
    {/* Body row: leave description + date range + day count */}
    <View className="flex-row items-center justify-between">
      <View className="gap-y-1.5">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-44 rounded" />
      </View>
      <Skeleton className="h-5 w-14 rounded" />
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics a {@link HomeLeavePreview} row.
 *
 * Renders a card-like row with a leave description + status badge on the
 * left, a chevron icon on the right, and date + day count subtext below.
 */
const LeavePreviewSkeleton = () => (
  <View className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    {/* Top row: description + badge + chevron */}
    <View className="mb-2 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-x-2">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
      <Skeleton className="ml-2 h-5 w-5 rounded" />
    </View>
    {/* Date range */}
    <Skeleton className="mb-1 h-3 w-36 rounded" />
    {/* Day count */}
    <Skeleton className="h-3 w-12 rounded" />
  </View>
);

/**
 * Full-page skeleton loading state for the home dashboard screen.
 *
 * Mirrors the layout of {@link HomeScreen} with shimmer placeholders for:
 * - `HomeHeader` (greeting + user name)
 * - `HomeQuickActions` (four action-icon buttons)
 * - `HomeActiveLeaveCard` (one active leave card)
 * - Section heading "Active Leaves"
 * - Section heading "Leave History" + three `HomeLeavePreview` rows
 *
 * Replace the generic `<LoadingScreen />` in `home-screen.tsx` with this
 * component to provide a content-aware loading experience.
 *
 * @example
 * ```tsx
 * // In home-screen.tsx:
 * if (isLoading) return <HomeScreenSkeleton />;
 * ```
 */
export const HomeScreenSkeleton = () => (
  <Container className="flex-1">
    <ScrollView>
      {/* HomeHeader placeholder */}
      <HomeHeaderSkeleton />

      {/* Quick Actions section */}
      <View className="mb-6">
        <QuickActionsSkeleton />
      </View>

      {/* Active Leaves section */}
      <View className="mb-4">
        <Skeleton className="mb-4 h-5 w-32 rounded-md" />
        <ActiveLeaveCardSkeleton />
      </View>

      {/* Leave History section */}
      <View className="mb-6">
        <Skeleton className="mb-4 h-5 w-32 rounded-md" />
        <LeavePreviewSkeleton />
        <LeavePreviewSkeleton />
        <LeavePreviewSkeleton />
      </View>
    </ScrollView>
  </Container>
);
