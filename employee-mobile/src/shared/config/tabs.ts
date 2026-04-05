import { MaterialIcons } from '@expo/vector-icons';
import { RoleT } from '@/src/features/auth/types';

/**
 * Tab Route Definition
 */
export type TabRouteT = {
  name: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

/**
 * Common tabs accessible by all roles.
 */
export const COMMON_TABS: TabRouteT[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'statement/index', title: 'Statements', icon: 'receipt' },
  { name: 'leave/index', title: 'Leaves', icon: 'air' },
  { name: 'pension/index', title: 'Pension', icon: 'tag' },
];

/**
 * Tabs specifically for Super Admin.
 */
export const SUPER_ADMIN_TABS: TabRouteT[] = [
  ...COMMON_TABS,
  { name: 'profile', title: 'Profile', icon: 'person' },
];

/**
 * Default tabs for standard users.
 */
export const DEFAULT_USER_TABS: TabRouteT[] = [...COMMON_TABS];

/**
 * Resolves the tab configuration based on user role.
 */
export const getTabConfig = (role: RoleT): TabRouteT[] => {
  switch (role) {
    case 'SUPER_ADMIN':
      return SUPER_ADMIN_TABS;
    case 'USER':
      return DEFAULT_USER_TABS;
    case 'ADMIN':
      return DEFAULT_USER_TABS;
    default:
      return DEFAULT_USER_TABS;
  }
};
