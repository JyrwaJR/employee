import { create } from 'zustand';
import * as ExpoUpdates from 'expo-updates';
import { Alert } from 'react-native';

type UpdateStore = {
  isUpdateAvailable: boolean;
  isUpdateReady: boolean;
  isDownloading: boolean;
  updateError: string | null;

  checkAndDownloadUpdate: () => Promise<void>;
  runUpdate: () => Promise<void>;
  skipUpdate: () => void;
};

export const useUpdateStore = create<UpdateStore>()((set) => ({
  isUpdateAvailable: false,
  isUpdateReady: false,
  isDownloading: false,
  updateError: null,

  checkAndDownloadUpdate: async () => {
    if (__DEV__) {
      console.log('[UpdateStore] Skipping update check in development mode.');
      return;
    }

    try {
      set({ updateError: null });
      const update = await ExpoUpdates.checkForUpdateAsync();

      if (update.isAvailable) {
        set({ isUpdateAvailable: true, isDownloading: true });

        const fetchResult = await ExpoUpdates.fetchUpdateAsync();
        if (fetchResult.isNew) {
          set({ isUpdateReady: true });
        }
        set({ isDownloading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown update error';
      console.error('[UpdateStore] Check failed:', errorMessage);
      set({ updateError: errorMessage, isDownloading: false });
    }
  },

  runUpdate: async () => {
    try {
      await ExpoUpdates.reloadAsync();
    } catch (error) {
      console.error('[UpdateStore] Reload failed:', error);
      Alert.alert('Error', 'Failed to apply update. Please restart the app manually.');
    }
  },

  skipUpdate: () => {
    set({ isUpdateReady: false });
  },
}));
