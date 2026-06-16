import { LocalAuthContext } from '@/src/shared/contexts/local-auth.context';
import { useContext } from 'react';

/**
 * Global Hook to access Local Authentication (Biometrics) State
 * Provides device compatibility status, enrollment, and methods to trigger
 * the biometric authentication process.
 */
export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);

  if (!context) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider');
  }

  return context;
};
