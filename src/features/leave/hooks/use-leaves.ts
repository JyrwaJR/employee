import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { QUERY_KEYS, METHODS } from '@utils/constants';
import { useAuthStore } from '@stores/auth.store';
import { LeaveResponse } from '@sharedTypes/leave';

export function useLeaves() {
  const { isSignedIn, emp_cd } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.LEAVE.LIST(emp_cd),
    queryFn: () => rpc<LeaveResponse>(METHODS.GET_EMP_LEAVE_DETAILS, { emp_cd }),
    select: (data) => data.data,
    enabled: !!emp_cd && isSignedIn,
  });
}
