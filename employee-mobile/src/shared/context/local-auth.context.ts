import { LocalAuthContextType } from '@/src/shared/types/auth'; // Updated to Shared Types
import { createContext } from 'react';

export const LocalAuthContext = createContext<LocalAuthContextType>({
  isSupported: false,
  isEnrolled: false,
  isAuthenticated: false,
  authenticate: async () => false,
});
