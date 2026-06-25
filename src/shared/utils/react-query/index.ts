import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { logger } from '@utils/logger';
import { toast } from 'sonner-native';

export * from './focus-manager';
export * from './online-manager';

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error('Something went wrong', { description: error.message });
      logger.log('Something went wrong', error);
      return error;
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});
