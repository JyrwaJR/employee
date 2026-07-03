import { SalaryStatement } from '@sharedTypes/satatement';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { transformData } from '@utils/helpers/transform-data';

export function useSalaryStatements() {
  const { emp_cd, isSignedIn } = useAuthStore();
  const { data, isFetched, isError, error, refetch, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEYS.SALARY.STATEMENTS(emp_cd),
    queryFn: () => rpc<SalaryStatement[]>(METHODS.GET_EMP_SALARY_STATEMENTS, { emp_cd }),
    staleTime: STALE_TIMES.SALARY,
    select: (data) => data?.data,
    enabled: !!emp_cd && isSignedIn,
  });

  const transformedData = transformData<SalaryStatement>(data);

  return { data: transformedData, isFetched, isError, error, refetch, isLoading, isFetching };
}
