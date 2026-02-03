import { LocalAuthContextType } from '@/src/types/context/auth/localAuth';
import { createContext } from 'react';

export const LocalAuthContext = createContext<LocalAuthContextType>({
  isSupported: false,
  isEnrolled: false,
  isAuthenticated: false,
  authenticate: async () => false,
});
