import { http } from '@/src/shared/utils/api/http';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '../types';
import { ENDPOINTS } from '@/src/shared/constants/endpoints';
import { queryKeys } from '@/src/shared/constants/query-keys';
import React from 'react';
import { toast } from '@/src/shared/components/ui';

type UseEmployeeProps = {
  page?: number;
};

export function useEmployees({ page }: UseEmployeeProps = { page: 1 }) {
  const query = useQuery({
    queryKey: queryKeys.employees.list(page),
    queryFn: () => http.get<EmployeeT[]>(ENDPOINTS.EMPLOYEE.LIST),
    select: (data) => data.data || [],
    placeholderData: (prev) => prev,
  });

  const { isError, error } = query;

  React.useEffect(() => {
    let isMounted = true;
    if (isError && isMounted) {
      toast.error('Update Failed', {
        description: (error as any)?.message || 'Could not update employee details',
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isError, error]);

  return query;
}
