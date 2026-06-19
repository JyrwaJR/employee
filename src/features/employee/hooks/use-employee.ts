import { EMPLOYEE_ENDPOINT, EMPLOYEE_KEYS } from '@features/employee/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { http } from '@utils/api/http';

type UseEmployeeProps = { employeeId: string };

export function useEmployee({ employeeId: idx }: UseEmployeeProps) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.DETAILS(idx),
    queryFn: () => http.get<EmployeeT>(EMPLOYEE_ENDPOINT.DETAILS(idx)),
    select: (data) => data.data,
    enabled: !!idx,
  });
}
