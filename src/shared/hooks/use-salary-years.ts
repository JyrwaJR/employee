import { SalaryYear } from '@sharedTypes/satatement/salary-years';
import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';

export function useSalaryYears() {
  const { emp_cd } = useAuthStore();
  return useQuery({
    queryKey: QUERY_KEYS.SALARY_YEAR(emp_cd),
    queryFn: () => rpc<SalaryYear[]>(METHODS.GET_SALARY_YEARS, { emp_cd }),
    enabled: !!emp_cd,
    refetchOnMount: true,
    staleTime: 0,
    select: (data) => data.data,
  });
}
