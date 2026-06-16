import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/src/shared/components/ui/skeleton';

/**
 * Skeleton Loading State for Announcements
 * Uses the shared Skeleton component for consistent pulse animations.
 */
export const AnnouncementSkeleton = () => (
  <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="mb-3 h-5 w-20 rounded-full" />
    <Skeleton className="mb-2 h-6 w-full rounded-md" />
    <Skeleton className="mb-4 h-4 w-3/4 rounded-md" />
    <View className="flex-row items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-800">
      <Skeleton className="h-3 w-16 rounded" />
      <Skeleton className="h-3 w-12 rounded" />
    </View>
  </View>
);
