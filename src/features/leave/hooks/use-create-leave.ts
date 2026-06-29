import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { CreateLeaveInputs } from '../validators';

export function useCreateLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: QUERY_KEYS.LEAVE.LIST(),
    mutationFn: (data: CreateLeaveInputs) =>
      rpc<{ id: string }>(METHODS.CREATE_LEAVE_REQUEST, data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEAVE.LIST() });
        return data;
      }
    },
  });
}
