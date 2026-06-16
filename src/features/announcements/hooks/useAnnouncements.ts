import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/api/query-keys';
import { AnnouncementResponseT, AnnouncementT } from '../types';

/**
 * Mock API Fetcher for Announcements
 * Simulates a paginated backend call with artificial delay.
 */
const fetchAnnouncementsMock = async ({ pageParam = 1 }): Promise<AnnouncementResponseT> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate 10 mock items per page
  const items: AnnouncementT[] = Array.from({ length: 10 }).map((_, i) => {
    const id = `ann-${pageParam}-${i}`;
    const categories: AnnouncementT['category'][] = ['HOLIDAY', 'NOTICE', 'PERSONAL', 'GLOBAL'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    return {
      id,
      title: `${category.charAt(0) + category.slice(1).toLowerCase()} Board Update #${pageParam}-${i}`,
      description: `This is a sample description for the ${category.toLowerCase()} announcement. It provides key information for the employee dashboard.`,
      category,
      priority: Math.random() > 0.8 ? 'HIGH' : 'LOW',
      isRead: Math.random() > 0.3,
      createdAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    };
  });

  return {
    items,
    total: 50,
    page: pageParam,
    hasMore: pageParam < 5,
  };
};

/**
 * Hook to manage paginated announcement data.
 */
export const useAnnouncements = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.announcements.list(),
    queryFn: fetchAnnouncementsMock,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (!lastPage.hasMore ? undefined : lastPage.page + 1),
    // Correction: Standardizing pagination logic
    getPreviousPageParam: (firstPage) => (firstPage.page > 1 ? firstPage.page - 1 : undefined),
  });
};
