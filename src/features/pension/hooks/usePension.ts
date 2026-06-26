import { SalarySlip } from '@features/employee';
import { useAuthStore } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { PENSION_ENDPOINT } from '../utils/constants';
import { QUERY_KEYS } from '@utils/constants';

export function usePension(pensionId: string) {
  const { user } = useAuthStore();
  const empId = user?.employee_id || '';
  return useQuery({
    queryKey: QUERY_KEYS.PENSION.DETAIL(empId, pensionId),
    queryFn: () => http.get<SalarySlip[]>(PENSION_ENDPOINT.DETAILS(empId, pensionId)),
    select: (data) => data.data,
    enabled: !!empId,
  });
}
