import { ENDPOINTS } from '@utils/constants/endpoints';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { http } from '@/src/shared/utils/api/http';
import { toast } from '@/src/shared/components/ui';
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
    mutationFn: (data: SignUpInputs) => http.post(ENDPOINTS.AUTH.SIGN_UP, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace(PAGE_ROUTES.AUTH.LOGIN);
        toast.success('Registration Success', {
          description: data.message || 'Sign up successful',
        });
      } else {
        toast.error('Registration Failed', {
          description: data.message || 'Could not complete registration',
        });
      }
      return data;
    },
  });
}
