import { sharedEndpoints } from '@/src/shared/api';
import { queryKeys } from '@/src/shared/api/query-keys';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { http } from '@/src/shared/utils/http';

type UseEmployeeProps = { employeeId: string };

export function useEmployee({ employeeId: idx }: UseEmployeeProps) {
  return useQuery({
    queryKey: queryKeys.employees.details(idx),
    queryFn: () => http.get<EmployeeT>(sharedEndpoints.employees.details(idx)),
    select: (data) => data.data,
    enabled: !!idx,
  });
}
