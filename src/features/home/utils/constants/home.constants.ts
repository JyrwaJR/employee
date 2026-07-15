import { HomeQuickAction } from '@features/home/types';
import { PAGE_ROUTES } from '@utils/constants/routes';

/** Preset list of quick-action shortcuts for the home dashboard. */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  { label: 'Apply Leave', icon: 'calendar-outline', route: PAGE_ROUTES.LEAVE.CREATE },
  { label: 'Leaves', icon: 'calendar-clear-outline', route: PAGE_ROUTES.LEAVE.INDEX },
  { label: 'View Salary', icon: 'cash-outline', route: PAGE_ROUTES.STATEMENT },
  { label: 'Announcement', icon: 'notifications-outline', route: '/announcements' },
];
