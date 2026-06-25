import { useQuery } from '@tanstack/react-query';
import { HomeDashboardT } from '../types/dashboard';
import { rpc } from '@utils/api';
import { METHODS } from '@utils/constants';

export function useHomeDashboard() {
  return useQuery({
    queryKey: ['home', 'overview'],
    queryFn: () => rpc<HomeDashboardT>(METHODS.GET_OVERVIEW),
    select: (data) => data.data,
  });
}
