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
 * Singleton React Query client configured for production.
 *
 * - 5-minute stale time with 30-minute garbage collection window.
 * - Query errors trigger a global toast and structured log (individual queries
 *   can opt out via `meta: { silent: true }`).
 * - Mutation errors trigger an on-screen toast and are logged.
 * - Refetch on reconnect is enabled; window focus refetch is disabled
 *   (mobile uses AppState-based focus manager instead).
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.silent !== true) {
        toast.error('Something went wrong', { description: error.message });
      }
      logger.error('Query error', error, { queryKey: query.queryKey });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error('Something went wrong', { description: error.message });
      logger.error('Mutation error', error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 min — gives persistence time to serialize
      retry: 3,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false, // mobile: AppState-based, not visibilitychange
    },
  },
});
