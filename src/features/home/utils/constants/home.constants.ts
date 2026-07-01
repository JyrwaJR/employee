import { HomeQuickAction } from '@features/home/types';
import { PAGE_ROUTES } from '@utils/constants/routes';

/** Preset list of quick-action shortcuts for the home dashboard. */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  { label: 'Apply Leave', icon: 'calendar-plus', route: PAGE_ROUTES.LEAVE.CREATE },
  { label: 'Leaves', icon: 'calendar-check', route: PAGE_ROUTES.LEAVE.INDEX },
  { label: 'View Salary', icon: 'currency-inr', route: PAGE_ROUTES.STATEMENT },
  { label: 'Attendance', icon: 'clipboard-check', route: '' },
];
