import { useQuery } from '@tanstack/react-query';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { AnnouncementT } from '../types';
import { rpc } from '@utils/api';
import { transformData } from '@utils/helpers';

/**
 * Hook to manage paginated announcement data.
 */
export const useAnnouncements = () => {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.ANNOUNCEMENT.LIST(),
    queryFn: () => rpc<AnnouncementT[]>(METHODS.GET_NOTIFICATIONS),
    select: (res) => res.data,
  });

  const announcement = transformData<AnnouncementT>(data);

  return { data: announcement, isFetching, isLoading, refetch };
};
