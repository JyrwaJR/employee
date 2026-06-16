import { queryClient } from '@/src/shared/utils/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export const TQueryProvider = ({ children }: Props) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
