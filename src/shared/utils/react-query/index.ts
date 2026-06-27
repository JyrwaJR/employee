import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { logger } from '@utils/logger';
import { toast } from 'sonner-native';

/**
 * React Query utilities barrel module.
 *
 * @module react-query
 */

export * from './focus-manager';
export * from './online-manager';

/**
 * Singleton React Query client configured with sensible defaults.
 *
 * - Queries have a 5-minute stale time and retry up to 3 times.
 * - Mutation errors trigger an on-screen toast and are logged to the remote server.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error('Something went wrong', { description: error.message });
      logger.error('Mutation error', error);
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
