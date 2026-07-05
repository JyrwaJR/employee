import React from 'react';
import { SectionHeader } from '@components/common/section-header';
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
export const HomeHeader = ({ subtitle, userName }: HomeHeaderProps) => (
  <SectionHeader variant="section" title={userName || 'Loading...'} subtitle={subtitle} />
);
