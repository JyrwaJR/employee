import { METHODS, QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { UserT } from '@sharedTypes/auth';
import { useAuthStore } from '@stores/auth.store';

type UseEmployeeProps = { emp_cd: string };

export function useEmployee({ emp_cd: idx }: UseEmployeeProps) {
  const { isSignedIn } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.DETAILS(idx),
    queryFn: () => rpc<UserT>(METHODS.GET_EMP_DETAILS, { emp_cd: idx }),
    staleTime: STALE_TIMES.EMPLOYEE,
    select: (data) => data.data,
    enabled: !!idx && isSignedIn,
  });
}
