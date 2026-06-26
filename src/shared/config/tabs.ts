import { RoleT } from '@sharedTypes/auth';
import { TabRouteT } from '@sharedTypes/tab';

/**
 * Common tabs accessible by all roles.
 */
export const COMMON_TABS: TabRouteT[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'statement/index', title: 'Statements', icon: 'receipt' },
  { name: 'leaves/index', title: 'Leaves', icon: 'air' },
  // { name: 'pension/index', title: 'Pension', icon: 'tag' },
  { name: 'profile/index', title: 'Profile', icon: 'person' },
];

/**
 * Tabs specifically for Super Admin.
 */
export const SUPER_ADMIN_TABS: TabRouteT[] = [...COMMON_TABS];

/**
 * Default tabs for standard users.
 */
export const DEFAULT_USER_TABS: TabRouteT[] = [...COMMON_TABS];

/**
 * Resolves the tab configuration based on user role.
 */
export const getTabConfig = (role: RoleT): TabRouteT[] => {
  switch (role) {
    default:
      return DEFAULT_USER_TABS;
  }
};
