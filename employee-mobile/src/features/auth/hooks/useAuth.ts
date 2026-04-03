import { AuthContext } from '@/src/features/auth/context/auth.context';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}
