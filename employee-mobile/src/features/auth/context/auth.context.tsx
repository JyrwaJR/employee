import { AuthContextT } from '@/src/features/auth/types';
import React from 'react';

export const AuthContext = React.createContext<AuthContextT | null>(null);
