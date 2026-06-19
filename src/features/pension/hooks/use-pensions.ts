import { SalarySlip } from '@features/employee';
import { useAuth } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS, queryKeys } from '@utils/constants';
import { buildUrlWithQuery } from '@utils/helpers';

export function usePensions(year: string, month: string, status: string) {
  const { user } = useAuth();
  const empId = user?.employee_id || '';

  return useQuery({
    queryKey: queryKeys.pension.list(empId, year, month, status),
    queryFn: () =>
      http.get<SalarySlip[]>(
        buildUrlWithQuery(ENDPOINTS.PENSION.LIST(empId), { year, month, status })
      ),
    select: (data) => data.data,
    enabled: !!empId,
  });
}
