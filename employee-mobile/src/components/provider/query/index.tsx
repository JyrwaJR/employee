import { queryClient } from '@/src/utils/reactQuery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export const TQueryProvider = ({ children }: Props) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
