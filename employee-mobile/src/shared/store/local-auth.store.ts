import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

/**
 * Global Local Authentication Store
 *
 * Manages the user's preference for biometric authentication.
 * Persists the 'isEnabled' state securely using expo-secure-store.
 */
type LocalAuthStore = {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
};

export const useLocalAuthStore = create<LocalAuthStore>()(
  persist(
    (set) => ({
      isEnabled: false,
      setIsEnabled: (value: boolean) => set({ isEnabled: value }),
    }),
    {
      name: 'local-auth-storage', // Key name for persistence
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    }
  )
);
