import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { LoginSchema } from '../validators/login.schema';
import { TokenStoreManager } from '@stores/token.store';
import { toast } from '@components/ui';
import { useAuthStore } from '@stores/auth.store';
import { logger } from '@utils/logger/logger';
import { rpc } from '@utils/api/rpc';
import { AUTH_METHODS } from '../utils/constants/methods';

type LoginFormInputs = z.infer<typeof LoginSchema>;

type LoginResT = {
  access_token: string;
  refresh_token: string;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginFormInputs) =>
      rpc<LoginResT, LoginFormInputs>(AUTH_METHODS.EMPLOYEE_LOGIN, {
        emp_cd: data.emp_cd,
        password: data.password,
      }),
    onSuccess: async (data) => {
      if (data.success) {
        const res = data.data;
        const accessToken = res?.access_token || res?.refresh_token;
        const refreshToken = res?.refresh_token;

        if (accessToken && refreshToken) {
          await TokenStoreManager.addToken(accessToken);
          await TokenStoreManager.addRefreshToken(refreshToken);

          toast.success('Authentication Success', {
            description: data.message || 'Sign in successful',
          });
          useAuthStore.getState().fetchUser();
          return data;
        } else {
          const missing = !accessToken ? 'Access Token' : 'Refresh Token';

          logger.error(`LoginScreen: Successful login but ${missing} is missing.`, {
            hasAccess: !!accessToken,
            hasRefresh: !!refreshToken,
          });

          toast.error('Authentication Failed', {
            description: 'Auth synchronization failed. Please try again.',
          });
        }
      } else {
        toast.error('Authentication Failed', {
          description: data.message || 'Invalid credentials',
        });
      }
    },
  });
};
