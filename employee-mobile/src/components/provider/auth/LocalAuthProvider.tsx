import React, { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { LocalAuthContext } from '@/src/libs/context/auth/localAuth';
import { logger } from '@/src/utils/logger';

export const LocalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);
      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);
      }
    })();
  }, []);

  const authenticate = async () => {
    try {
      if (!isSupported || !isEnrolled) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentication Required',
        fallbackLabel: 'Enter Password',
      });

      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Local Auth Error:', error);
      return false;
    }
  };

  return (
    <LocalAuthContext.Provider value={{ isSupported, isEnrolled, isAuthenticated, authenticate }}>
      {children}
    </LocalAuthContext.Provider>
  );
};
