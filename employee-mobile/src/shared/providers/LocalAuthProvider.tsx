import React, { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { LocalAuthContext } from '@/src/shared/context/local-auth.context';
import { logger } from '@/src/shared/utils/logger';

/**
 * Global Local Authentication Provider
 * 
 * Manages biometric hardware interaction:
 * 1. Hardware Check: Verifies if the device supports biometric auth.
 * 2. Enrollment Sync: Tracks if the user has fingerprints/face enrolled.
 * 3. Atomic Authentication: Provides a high-level method to trigger prompts.
 */
export const LocalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsSupported(compatible);
        if (compatible) {
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        logger.error('LocalAuthProvider: Hardware Detection Error', error);
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
      logger.error('LocalAuthProvider: Interaction Error', error);
      return false;
    }
  };

  return (
    <LocalAuthContext.Provider value={{ isSupported, isEnrolled, isAuthenticated, authenticate }}>
      {children}
    </LocalAuthContext.Provider>
  );
};
