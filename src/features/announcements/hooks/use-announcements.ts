import { useQuery } from '@tanstack/react-query';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { AnnouncementResponseT } from '../types';
import { rpc } from '@utils/api';

/**
 * Hook to manage paginated announcement data.
 */
export const useAnnouncements = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ANNOUNCEMENT.LIST(),
    queryFn: () => rpc<AnnouncementResponseT>(METHODS.GET_ANNOUNCEMENTS),
    select: (res) => res.data,
  });
};
