import React, { useEffect, useState, useCallback } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import { UpdatesContext } from '../context/update.context';

export const UpdatesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const checkAndDownloadUpdate = useCallback(async () => {
    if (__DEV__) {
      console.log('[UpdatesProvider] Skipping update check in development mode.');
      return;
    }

    try {
      setUpdateError(null);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        setIsDownloading(true);

        const fetchResult = await Updates.fetchUpdateAsync();
        if (fetchResult.isNew) {
          setIsUpdateReady(true);
        }
        setIsDownloading(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown update error';
      console.error('[UpdatesProvider] Check failed:', errorMessage);
      setUpdateError(errorMessage);
      setIsDownloading(false);
    }
  }, []);

  const runUpdate = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('[UpdatesProvider] Reload failed:', error);
      Alert.alert('Error', 'Failed to apply update. Please restart the app manually.');
    }
  }, []);

  const skipUpdate = useCallback(() => {
    setIsSkipped(true);
  }, []);

  useEffect(() => {
    checkAndDownloadUpdate();
  }, [checkAndDownloadUpdate]);

  const value = {
    isUpdateAvailable,
    isUpdateReady: isUpdateReady && !isSkipped,
    isDownloading,
    updateError,
    checkAndDownloadUpdate,
    runUpdate,
    skipUpdate,
  };

  return <UpdatesContext.Provider value={value}>{children}</UpdatesContext.Provider>;
};
