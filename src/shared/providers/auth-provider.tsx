import { useEffect } from 'react';
import { useAuthStore } from '@stores/auth.store';

type Props = {
  children: React.ReactNode;
};

export const AuthInitializer = ({ children }: Props) => {
  const hydrate = useAuthStore((s) => s._hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
};
