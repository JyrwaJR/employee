import { SalarySlip } from '@features/employee';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { SALARY_ENDPOINT } from '../utils/constants';
import { QUERY_KEYS } from '@utils/constants';

export function useSalaryStatement(id: string, isTab?: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.SALARY.STATEMENTS(id, isTab),
    queryFn: () => http.get<SalarySlip[]>(SALARY_ENDPOINT.LIST(id)),
    select: (data) => data.data,
    enabled: !!id,
  });
}
