import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/src/shared/stores/theme.store';

export const useTheme = () => {
  const { theme } = useThemeStore();
  const colorScheme = useColorScheme();
  const isColorSchemeDark = colorScheme !== null && colorScheme === 'dark';
  return theme === 'system' ? (isColorSchemeDark ? 'dark' : 'light') : theme;
};
