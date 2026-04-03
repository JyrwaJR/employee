import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/src/shared/store/theme.store';

export const useTheme = () => {
  const { theme } = useThemeStore();
  const colorScheme = useColorScheme();
  return theme === 'system' ? colorScheme : theme;
};
