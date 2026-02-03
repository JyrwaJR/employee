import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

type UseLocalAuthStore = {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
};

//
// persis in secure storage

export const useLocalAuthStore = create<UseLocalAuthStore>()(
  persist(
    (set) => ({
      isEnabled: false,
      setIsEnabled: (value: boolean) => set({ isEnabled: value }),
    }),
    {
      name: 'local-auth',
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    }
  )
);
