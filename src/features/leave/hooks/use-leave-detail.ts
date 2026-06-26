import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, METHODS } from '@utils/constants';
import { rpc } from '@utils/api';
import { useAuthStore } from '@stores/auth.store';
import { Leave, LeaveBal } from '@sharedTypes/leave';

interface LeaveResponse extends Leave {
  leave_bal: LeaveBal;
}

export function useLeaveDetail(id: string) {
  const { isSignedIn } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.LEAVE.DETAILS(id),
    queryFn: () => rpc<LeaveResponse>(METHODS.GET_EMP_LEAVE_DETAILS_DETAILS, { leave_id: id }),
    enabled: !!id && isSignedIn,
    select: (data) => data.data,
  });
}
