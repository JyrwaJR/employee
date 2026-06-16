import { http } from '@/src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { sharedEndpoints } from '@/src/shared/api';
import { queryKeys } from '@/src/shared/api/query-keys';
import React from 'react';
import { notify } from '@/src/shared/utils/notify';

type UseEmployeeProps = {
  page?: number;
};

export function useEmployees({ page }: UseEmployeeProps = { page: 1 }) {
  const query = useQuery({
    queryKey: queryKeys.employees.list(page),
    queryFn: () => http.get<EmployeeT[]>(sharedEndpoints.employees.list),
    select: (data) => data.data || [],
    placeholderData: (prev) => prev,
  });

  const { isError, error } = query;

  React.useEffect(() => {
    let isMounted = true;
    if (isError && isMounted) {
      notify(error, 'EMPLOYEE_UPDATE');
    }
    return () => {
      isMounted = false;
    };
  }, [isError, error]);

  return query;
}
