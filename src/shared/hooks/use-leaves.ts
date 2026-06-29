import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { QUERY_KEYS, METHODS } from '@utils/constants';
import { useAuthStore } from '@stores/auth.store';
import { Leave } from '@sharedTypes/leave';
import { transformData } from '@utils/helpers/transform-data';

export function useLeaves() {
  const { isSignedIn, emp_cd } = useAuthStore();

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.LEAVE.LIST(emp_cd),
    queryFn: () => rpc<Leave[]>(METHODS.GET_EMP_LEAVE_DETAILS, { emp_cd }),
    select: (data) => data.data,
    enabled: !!emp_cd && isSignedIn,
  });

  return { data: transformData<Leave>(data), isFetching, isLoading, refetch };
}
