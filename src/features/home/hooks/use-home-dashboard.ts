import { useQuery } from '@tanstack/react-query';
import { HomeDashboardT } from '@features/home/validators/deshboard.schema';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { useAuthStore } from '@stores/auth.store';

export function useHomeDashboard() {
  const { isSignedIn } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.HOME.OVERVIEW,
    queryFn: () => rpc<HomeDashboardT>(METHODS.GET_OVERVIEW),
    select: (data) => data.data,
    enabled: isSignedIn,
  });
}
