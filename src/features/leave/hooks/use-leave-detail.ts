import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, METHODS, STALE_TIMES } from '@utils/constants';
import { rpc } from '@utils/api';
import { useAuthStore } from '@stores/auth.store';
import { Leave, LeaveBal } from '@sharedTypes/leave';

interface LeaveResponse extends Leave {
  leave_bal: LeaveBal;
}

type Props = {
  leave_cd: string;
  order_dt: string;
  from_dt: string;
};

export function useLeaveDetail({ from_dt, leave_cd, order_dt }: Props) {
  const { isSignedIn, emp_cd } = useAuthStore();
  const isEnable = !!emp_cd && isSignedIn && !!from_dt && !!leave_cd && !!order_dt;
  return useQuery({
    queryKey: QUERY_KEYS.LEAVE.DETAILS(emp_cd, from_dt, leave_cd, order_dt),
    queryFn: () =>
      rpc<LeaveResponse>(METHODS.GET_EMP_LEAVE_DETAILS, {
        emp_cd,
        from_dt,
        leave_cd,
        order_dt,
      }),
    staleTime: STALE_TIMES.LEAVE_FAST,
    enabled: isEnable,
    select: (data) => data.data,
  });
}
