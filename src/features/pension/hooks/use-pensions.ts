import { SalarySlip } from '@features/employee';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { axioshttp } from '@utils/api';
import { PENSION_ENDPOINT } from '../utils/constants';
import { PENSION_KEYS, STALE_TIMES } from '@utils/constants';
import { buildUrlWithQuery } from '@utils/helpers';

export function usePensions(year: string, month: string, status: string) {
  const { user } = useAuthStore();
  const empId = user?.employee_id || '';

  return useQuery({
    queryKey: PENSION_KEYS.LIST(empId, year, month, status),
    queryFn: () =>
      axioshttp.get<SalarySlip[]>(
        buildUrlWithQuery(PENSION_ENDPOINT.LIST(empId), { year, month, status })
      ),
    staleTime: STALE_TIMES.PENSION,
    select: (data) => data.data,
    enabled: !!empId,
  });
}
