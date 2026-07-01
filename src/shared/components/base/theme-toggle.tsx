import { useThemeStore } from '@stores/theme.store';
import { Icon } from '@components/ui/icon';
import { TouchableOpacity } from 'react-native';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Icon
        family="ionicons"
        name={theme === 'dark' ? 'moon' : 'sunny'}
        size={24}
        color={theme === 'dark' ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );
};
