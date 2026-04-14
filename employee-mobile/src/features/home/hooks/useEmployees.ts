import { queryKeys } from '@/src/shared/api/query-keys';
import { http } from '@/src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../../employee';
import { api } from '@/src/shared/api';
import { useAuth } from '@/src/shared/hooks/useAuth';

type UseEmployeeProps = {
  page?: number;
};

export function useEmployees({ page }: UseEmployeeProps = { page: 1 }) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.employees.list(page),
    queryFn: () => http.get<EmployeeT[]>(api.employees.list),
    select: (data) => data.data || [],
    enabled: isSignedIn,
  });
}
