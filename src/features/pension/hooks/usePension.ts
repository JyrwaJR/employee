import { SalarySlip } from '@features/employee';
import { useAuth } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS, QUERY_KEYS } from '@utils/constants';

export function usePension(pensionId: string) {
  const { user } = useAuth();
  const empId = user?.employee_id || '';
  return useQuery({
    queryKey: QUERY_KEYS.PENSION.DETAIL(empId, pensionId),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.PENSION.DETAILS(empId, pensionId)),
    select: (data) => data.data,
    enabled: !!empId,
  });
}
