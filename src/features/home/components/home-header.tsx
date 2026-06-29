import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SectionHeader } from '@components/base/section-header';
import type { ThemeType } from '@stores/theme.store';

interface HomeHeaderProps {
  /** Greeting subtitle — e.g. "Good Morning · Engineering". */
  subtitle: string;
  /** User's full name — shown as the header title. */
  userName: string;
  /** Current theme for icon color selection. */
  theme: ThemeType;
  /** Logout callback. */
  onLogout: () => void;
}

/** App header for the home screen: greeting, bell icon, and logout button. */
export const HomeHeader = ({ subtitle, userName, theme, onLogout }: HomeHeaderProps) => (
  <SectionHeader
    variant="section"
    title={userName || 'Loading...'}
    subtitle={subtitle}
    rightElement={
      <>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <MaterialCommunityIcons
            name="bell"
            size={24}
            color={theme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogout}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={theme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </>
    }
  />
);
