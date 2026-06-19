import { SalarySlip } from '@features/employee';
import { useAuth } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS, queryKeys } from '@utils/constants';

export function usePension(pensionId: string) {
  const { user } = useAuth();
  const empId = user?.employee_id || '';
  return useQuery({
    queryKey: queryKeys.pension.detail(empId, pensionId),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.PENSION.DETAILS(empId, pensionId)),
    select: (data) => data.data,
    enabled: !!empId,
  });
}
