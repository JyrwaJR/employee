import { AuthContextT } from '@types/auth';
import React from 'react';

export const AuthContext = React.createContext<AuthContextT | null>(null);
