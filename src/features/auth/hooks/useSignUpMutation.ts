import { sharedEndpoints } from '@/src/shared/api';
import { routes } from '@/src/shared/constants/routes';
import { http } from '@/src/shared/utils/http';
import { notify } from '@/src/shared/utils/notify';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { SignUpSchema } from '../validators/signup.schema';
import { z } from 'zod';

/**
 * Type-safe Sign Up Mutation.
 * Removed the 'any' cast and generic <T> to ensure strict payload validation.
 */

type SignUpInputs = z.infer<typeof SignUpSchema>;

export function useSignUpMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpInputs) => http.post(sharedEndpoints.auth.signUp, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace(routes.auth.login);
      }
      notify(data, 'AUTH_REGISTER');
      return data;
    },
  });
}
