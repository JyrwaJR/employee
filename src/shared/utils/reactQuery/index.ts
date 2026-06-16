import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export * from './focusManger';
export * from './onlineManager';

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});
