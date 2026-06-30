import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { CreateLeaveInputs } from '../validators';
import { useAuthStore } from '@stores/auth.store';

/**
 * Creates a leave request via the `create_leave_request` RPC.
 *
 * Automatically attaches the authenticated employee code (`emp_cd`) from
 * the auth store to the payload so callers do not need to pass it.
 *
 * ### State transitions
 *
 * | State          | Meaning                                    |
 * |----------------|--------------------------------------------|
 * | `isPending`    | The RPC request is in-flight               |
 * | `isSuccess`    | The RPC returned `success: true`           |
 * | `isError`      | The RPC threw or returned network error    |
 *
 * ### Cache invalidation
 *
 * On a successful response (`data.success === true`) the entire leave list
 * query cache (`QUERY_KEYS.LEAVE.LIST`) is invalidated so any upstream
 * `useQuery` call picks up the new leave record.
 *
 * On failure the raw API response is returned as-is so callers can inspect
 * the `message` field for user-facing feedback.
 *
 * @param data - Form payload validated against `CreateLeaveSchema`.
 *                Required fields: `type`, `number_of_days`, `from_dt`,
 *                `to_dt`, `order_number`, `order_dt`, `reason`.
 *                Optional: `remarks`.
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateLeave();
 *
 * const handleSubmit = (inputs: CreateLeaveInputs) => {
 *   mutate(inputs, {
 *     onSuccess: (res) => {
 *       if (res.success) toast.success('Leave created');
 *     },
 *   });
 * };
 * ```
 */
export function useCreateLeave() {
  const queryClient = useQueryClient();
  const { emp_cd } = useAuthStore();
  return useMutation({
    mutationKey: QUERY_KEYS.LEAVE.LIST(emp_cd),
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
