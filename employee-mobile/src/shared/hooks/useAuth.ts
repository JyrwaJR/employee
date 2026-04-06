import { AuthContext } from '@/src/shared/context/auth.context';
import { useContext } from 'react';

/**
 * Global Hook to access Authentication State
 * Provides user profile, role-based access, and login/logout status 
 * to all application features.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
