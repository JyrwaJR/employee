import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { LEAVE_ENDPOINT } from '../utils/constants';
import { QUERY_KEYS } from '@utils/constants';
import { LeaveT } from '../types';
import { useAuthStore } from '@hooks';

export function useLeaves(year: string, status: string) {
  const { user } = useAuthStore();
  const empId = user?.employee_id || '';

  return useQuery({
    queryKey: QUERY_KEYS.LEAVE.LIST(empId, year, status),
    queryFn: () => http.get<LeaveT[]>(LEAVE_ENDPOINT.LIST(empId)),
    enabled: !!empId,
    select: (data) => data.data,
  });
}
