import { EMPLOYEE_ENDPOINT } from '@features/employee/utils/constants';
import { QUERY_KEYS } from '@utils/constants';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { http } from '@utils/api/http';

type UseEmployeeProps = { employeeId: string };

export function useEmployee({ employeeId: idx }: UseEmployeeProps) {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.DETAILS(idx),
    queryFn: () => http.get<EmployeeT>(EMPLOYEE_ENDPOINT.DETAILS(idx)),
    select: (data) => data.data,
    enabled: !!idx,
  });
}
