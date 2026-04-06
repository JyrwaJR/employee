import { AuthContextT } from '@/src/shared/types/auth';
import React from 'react';

export const AuthContext = React.createContext<AuthContextT | null>(null);
