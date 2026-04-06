import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { LoginSchema } from '../validators/login.schema';
import { http } from '@/src/shared/utils/http';
import { api } from '@/src/shared/api';
import { TokenStoreManager } from '@/src/shared/store/token.store';
import { notify } from '@/src/shared/utils/notify';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { logger } from '@/src/shared/utils/logger';

type LoginFormInputs = z.infer<typeof LoginSchema>;

type LoginResT = {
  created_at: string;
  first_name: string;
  last_name: string;
  refresh_token: string;
  role: string;
  updated_at: string;
};

export const useLoginMutation = () => {
  const { refresh } = useAuth();
  return useMutation({
    mutationFn: (data: LoginFormInputs) => http.post<LoginResT>(api.auth.login, data),
    onSuccess: async (data: any) => {
      if (data.success) {
        const responseData = data.data;

        // Robust token extraction (handles both 'token' top-level and 'access_token' in data)
        const accessToken = data.token || responseData?.access_token || responseData?.token;
        const refreshToken = responseData?.refresh_token;

        if (accessToken && refreshToken) {
          await TokenStoreManager.addToken(accessToken);
          await TokenStoreManager.addRefreshToken(refreshToken);

          notify(data, 'AUTH_LOGIN');
          refresh(); // Trigger auth state update
          return data;
        } else {
          // Failure to extract tokens after a successful response
          const missing = !accessToken ? 'Access Token' : 'Refresh Token';
          logger.error(`LoginScreen: Successful login but ${missing} is missing.`, {
            hasAccess: !!accessToken,
            hasRefresh: !!refreshToken,
          });

          notify(
            { success: false, message: 'Auth synchronization failed. Please try again.' },
            'AUTH_LOGIN'
          );
        }
      } else {
        notify(data, 'AUTH_LOGIN');
      }
    },
  });
};
