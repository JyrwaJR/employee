import { SalarySlip } from '@features/employee';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/api';
import { ENDPOINTS, queryKeys } from '@utils/constants';

export function useSalaryStatement(id: string, isTab?: boolean) {
  return useQuery({
    queryKey: queryKeys.salary.statements(id, isTab),
    queryFn: () => http.get<SalarySlip[]>(ENDPOINTS.SALARY.LIST(id)),
    select: (data) => data.data,
    enabled: !!id,
  });
}
