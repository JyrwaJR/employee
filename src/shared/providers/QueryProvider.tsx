import { queryClient } from '@/src/shared/utils/reactQuery';
import { QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export const TQueryProvider = ({ children }: Props) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
