import { Skeleton } from '@components/ui';
import { View } from 'react-native';

/**
 * Shared skeleton placeholder that mimics the {@link GovtHeader} component
 * used across salary, tax, and other feature detail screens.
 *
 * Layout:
 * - Department/subtitle badge (rectangle pill)
 * - Large title text placeholder
 * - Month/year badge (right-aligned pill)
 */
export const GovtHeaderSkeleton = () => (
  <View className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <View className="mb-3 flex-row items-center justify-between">
      <View className="gap-y-1.5">
        <Skeleton className="h-4 w-44 rounded" />
        <Skeleton className="h-3 w-28 rounded" />
      </View>
      <Skeleton className="h-6 w-20 rounded-full" />
    </View>
    <Skeleton className="h-7 w-56 rounded-md" />
  </View>
);
