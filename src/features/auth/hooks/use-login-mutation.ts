import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { LoginSchema } from '../validators/login.schema';
import { rpc } from '@utils/api';
import { TokenStoreManager } from '@stores/token.store';
import { ApiResponse } from '@sharedTypes/api';
import { useAuthStore } from '@stores/auth.store';
import { METHODS } from '@utils/constants';

type LoginFormInputs = z.infer<typeof LoginSchema>;

type LoginResponse = {
  access_token: string;
  expires_in: number;
  scope: 'default';
  token_type: 'Barear' | 'Basic';
};

export const useLoginMutation = () => {
  const { fetchUser, setEmpCode } = useAuthStore();
  return useMutation<ApiResponse<LoginResponse>, unknown, LoginFormInputs>({
    mutationFn: async (data) => {
      return await rpc<LoginResponse>(METHODS.EMP_LOGIN, {
        password: data.password,
        emp_cd: data.emp_cd,
      });
    },
    onSuccess: async (data, { emp_cd }) => {
      const empCode = emp_cd;
      if (empCode) {
        setEmpCode(empCode);
      }

      if (data.data?.access_token) {
        fetchUser();
        return data;
      }

      await TokenStoreManager.removeAccessToken();

      return data;
    },
    onError: async (error) => {
      await TokenStoreManager.removeAccessToken();
      return error;
    },
  });
};
