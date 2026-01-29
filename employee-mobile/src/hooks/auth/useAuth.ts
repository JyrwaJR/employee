import { AuthContext } from '@/src/libs/context/auth';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}
