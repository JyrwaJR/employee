import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PAGE_ROUTES } from '@utils/constants/routes';

/** A single quick-action shortcut item displayed on the home dashboard. */
export type HomeQuickAction = {
  /** Display label shown beneath the icon. */
  label: string;
  /** MaterialCommunityIcons glyph name. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** App route to navigate to on press. */
  route: string;
};

/** Preset list of quick-action shortcuts for the home dashboard. */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  { label: 'Apply Leave', icon: 'calendar-plus', route: PAGE_ROUTES.LEAVE.CREATE },
  { label: 'Leaves', icon: 'calendar-check', route: PAGE_ROUTES.LEAVE.INDEX },
  { label: 'View Salary', icon: 'currency-inr', route: PAGE_ROUTES.STATEMENT },
  { label: 'Attendance', icon: 'clipboard-check', route: '' },
];
