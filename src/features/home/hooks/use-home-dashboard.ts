import { useQuery } from '@tanstack/react-query';
import { HomeDashboardT } from '@features/home/validators/deshboard.schema';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { useAuthStore } from '@stores/auth.store';

/**
 * Fetches the home dashboard overview data.
 * Automatically disabled when the user is not signed in.
 * Returns the unwrapped `data` payload via the `select` transform.
 */
export function useHomeDashboard() {
  const { isSignedIn } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.HOME.OVERVIEW(),
    queryFn: () => rpc<HomeDashboardT>(METHODS.GET_OVERVIEW),
    select: (data) => data.data,
    enabled: isSignedIn,
  });
}
