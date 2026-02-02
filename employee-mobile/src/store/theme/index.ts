import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

type UseThemeStore = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<UseThemeStore>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme: ThemeType) => set({ theme }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => ({
                getItem: SecureStore.getItemAsync,
                setItem: SecureStore.setItemAsync,
                removeItem: SecureStore.deleteItemAsync,
            })),
        }
    )
);

export const useTheme = () => {
    const { theme } = useThemeStore();
    const colorScheme = useColorScheme();
    return theme === 'system' ? colorScheme : theme;
};
