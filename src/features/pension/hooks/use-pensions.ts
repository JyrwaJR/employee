import { SalarySlip } from '@features/employee';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { PENSION_ENDPOINT } from '../utils/constants';
import { QUERY_KEYS } from '@utils/constants';
import { buildUrlWithQuery } from '@utils/helpers';

export function usePensions(year: string, month: string, status: string) {
  const { user } = useAuthStore();
  const empId = user?.employee_id || '';

  return useQuery({
    queryKey: QUERY_KEYS.PENSION.LIST(empId, year, month, status),
    queryFn: () =>
      http.get<SalarySlip[]>(
        buildUrlWithQuery(PENSION_ENDPOINT.LIST(empId), { year, month, status })
      ),
    select: (data) => data.data,
    enabled: !!empId,
  });
}
