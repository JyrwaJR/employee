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

export function useEmpLeaveDetails() {
  const { isSignedIn } = useAuthStore();
  const { emp_cd } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.HOME.OVERVIEW(emp_cd),
    queryFn: () => rpc<HomeDashboardT[]>(METHODS.GET_EMP_LEAVE_DETAILS, { emp_cd }),
    select: (data) => data.data,
    enabled: isSignedIn && !!emp_cd,
  });
}
