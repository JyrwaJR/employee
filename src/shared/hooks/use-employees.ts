import { http } from '@utils/api/http';
import { useQuery } from '@tanstack/react-query';
import { EmployeeT } from '@features/employee/types';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { EMPLOYEE_KEYS } from '@features/employee/utils/constants';
import React from 'react';
import { toast } from '@components/ui';

type UseEmployeeProps = {
  page?: number;
};

export function useEmployees({ page }: UseEmployeeProps = { page: 1 }) {
  const query = useQuery({
    queryKey: EMPLOYEE_KEYS.LIST(page),
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
