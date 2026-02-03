import { LocalAuthContext } from '@/src/libs/context/auth/localAuth';
import { useContext } from 'react';

export const useLocalAuth = () => useContext(LocalAuthContext);
