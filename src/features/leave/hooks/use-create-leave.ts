import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { CreateLeaveInputs } from '../validators';
import { useAuthStore } from '@stores/auth.store';

export function useCreateLeave() {
  const queryClient = useQueryClient();
  const { emp_cd } = useAuthStore();
  return useMutation({
    mutationKey: QUERY_KEYS.LEAVE.LIST(),
    mutationFn: (data: CreateLeaveInputs) =>
      rpc<{ id: string }>(METHODS.CREATE_LEAVE_REQUEST, {
        ...data,
        emp_cd,
      }),
    onSuccess: (data, _v, _, context) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: context.mutationKey });
        return data.data;
      }
      return data;
    },
    onError: (error) => {
      return error;
    },
  });
}
