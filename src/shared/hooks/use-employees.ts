import { http } from '@utils/api/http';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '@features/employee/types';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { EMPLOYEE_KEYS } from '@features/employee/utils/constants';
import { buildUrlWithQuery } from '@utils/helpers';
import { useAuth } from './use-auth';

type UseEmployeeProps = {
  page?: number;
};

export function useEmployees({ page }: UseEmployeeProps = { page: 1 }) {
  const { isSignedIn } = useAuth();
  const query = useQuery({
    queryKey: EMPLOYEE_KEYS.LIST(page),
    queryFn: () => http.get<EmployeeT[]>(buildUrlWithQuery(ENDPOINTS.EMPLOYEE.LIST, { page })),
    select: (data) => data.data || [],
    placeholderData: (prev) => prev,
    enabled: isSignedIn,
  });

  return query;
}
