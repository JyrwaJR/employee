/** Home feature type definitions. */

import { MaterialCommunityIcons } from '@expo/vector-icons';

/** A single quick-action shortcut item displayed on the home dashboard. */
export type HomeQuickAction = {
  /** Display label shown beneath the icon. */
  label: string;
  /** MaterialCommunityIcons glyph name. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** App route to navigate to on press. */
  route: string;
};
