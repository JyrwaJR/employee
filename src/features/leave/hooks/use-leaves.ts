import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS } from '@utils/constants';
import { LEAVE_KEYS } from '../utils/constants';
import { LeaveT } from '../types';
import { useAuth } from '@hooks';

export function useLeaves(year: string, status: string) {
  const { user } = useAuth();
  const empId = user?.employee_id || '';

  return useQuery({
    queryKey: LEAVE_KEYS.LIST(empId, year, status),
    queryFn: () => http.get<LeaveT[]>(ENDPOINTS.LEAVE.LIST(empId)),
    enabled: !!empId,
    select: (data) => data.data,
  });
}
