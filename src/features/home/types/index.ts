/** Home feature type definitions. */

/** A single quick-action shortcut item displayed on the home dashboard. */
export type HomeQuickAction = {
  /** Display label shown beneath the icon. */
  label: string;
  /** Icon name. */
  icon: string;
  /** App route to navigate to on press. */
  route: string;
};
