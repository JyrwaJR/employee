import { LocalAuthContext } from '@/src/features/auth/context/local-auth.context';
import { useContext } from 'react';

export const useLocalAuth = () => useContext(LocalAuthContext);
