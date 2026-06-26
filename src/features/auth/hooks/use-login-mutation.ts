import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { LoginSchema } from '../validators/login.schema';
import { rpc } from '@utils/api';
import { TokenStoreManager } from '@stores/token.store';
import { ApiResponse } from '@sharedTypes/api';
import { useAuthStore } from '@stores/auth.store';
import { METHODS, QUERY_KEYS } from '@utils/constants';
import { logger } from '@utils/logger';

type LoginFormInputs = z.infer<typeof LoginSchema>;

type LoginResponse = {
  access_token: string;
  expires_in: number;
  scope: 'default';
  token_type: 'Barear' | 'Basic';
};

export const useLoginMutation = () => {
  const { fetchUser, setEmpCode } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LoginResponse>, unknown, LoginFormInputs>({
    mutationKey: QUERY_KEYS.AUTH.ME,
    meta: { auth: true },
    mutationFn: async (data) => {
      if (!data.emp_cd) throw new Error('Employee code is needed');
      // persisting employee code to secure store to fetch employee details after logging in
      setEmpCode(data.emp_cd);

      return await rpc<LoginResponse>(METHODS.EMP_LOGIN, {
        password: data.password,
        emp_cd: data.emp_cd,
      });
    },
    onSuccess: async (data, { emp_cd }, _, context) => {
      if (data.success) {
        logger.info('Successfully logged in');
        queryClient.invalidateQueries({ queryKey: context.mutationKey });
        if (emp_cd) {
          logger.info('Start Fetching user', emp_cd);
          fetchUser();
          logger.info('End Fetching user', emp_cd);
        }

        return data;
      }
      logger.info('Unsuccessful login Removing Current access Token Start');
      await TokenStoreManager.removeAccessToken();
      logger.info('Unsuccessful login Removing Current access Token End');

      return data;
    },
    onError: async (error) => {
      await TokenStoreManager.removeAccessToken();
      return error;
    },
  });
};
