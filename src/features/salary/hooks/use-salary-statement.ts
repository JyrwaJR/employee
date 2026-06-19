import { SalarySlip } from '@features/employee';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS } from '@utils/constants';
import { SALARY_KEYS } from '../utils/constants';

export function useSalaryStatement(id: string, isTab?: boolean) {
  return useQuery({
    queryKey: SALARY_KEYS.STATEMENTS(id, isTab),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.SALARY.LIST(id)),
    select: (data) => data.data,
    enabled: !!id,
  });
}
