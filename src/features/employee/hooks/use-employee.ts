import { ENDPOINTS } from '@utils/constants/endpoints';
import { QUERY_KEYS } from '@utils/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { http } from '@utils/api/http';

type UseEmployeeProps = { employeeId: string };

export function useEmployee({ employeeId: idx }: UseEmployeeProps) {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEES.DETAILS(idx),
    queryFn: () => http.get<EmployeeT>(ENDPOINTS.EMPLOYEE.DETAILS(idx)),
    select: (data) => data.data,
    enabled: !!idx,
  });
}
