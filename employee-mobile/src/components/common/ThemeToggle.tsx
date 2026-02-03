import { useThemeStore } from '@/src/store/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Ionicons
        name={theme === 'dark' ? 'moon' : 'sunny'}
        size={24}
        color={theme === 'dark' ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );
};
