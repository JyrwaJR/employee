import { TabRouteT } from '@sharedTypes/tab';

/**
 * Common tabs accessible by all roles.
 */
export const COMMON_TABS: TabRouteT[] = [
  { name: 'index', title: 'Home', icon: 'home-outline' },
  { name: 'statement/index', title: 'Statements', icon: 'receipt-outline' },
  { name: 'leaves/index', title: 'Leaves', icon: 'calendar-outline' },
  { name: 'profile/index', title: 'Profile', icon: 'person-outline' },
];

/**
 * Tabs specifically for Super Admin.
 */
export const SUPER_ADMIN_TABS: TabRouteT[] = [...COMMON_TABS];

/**
 * Default tabs for standard users.
 */
export const DEFAULT_USER_TABS: TabRouteT[] = [...COMMON_TABS];
