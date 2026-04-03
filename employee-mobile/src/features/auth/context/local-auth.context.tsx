import { LocalAuthContextType } from '@/src/features/auth/types/localAuth';
import { createContext } from 'react';

export const LocalAuthContext = createContext<LocalAuthContextType>({
  isSupported: false,
  isEnrolled: false,
  isAuthenticated: false,
  authenticate: async () => false,
});
