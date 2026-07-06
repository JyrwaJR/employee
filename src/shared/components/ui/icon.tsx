import MaterialCommunityIcons, {
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import Ionicons, { type IoniconsIconName } from '@react-native-vector-icons/ionicons';
import MaterialIcons, {
  type MaterialIconsIconName,
} from '@react-native-vector-icons/material-icons';

/**
 * Maps each {@link IconFamily} to the corresponding icon-name literal
 * union exported by the `@react-native-vector-icons/*` package.
 */
export type IconFamilyMap = {
  'material-community': MaterialDesignIconsIconName;
  ionicons: IoniconsIconName;
  material: MaterialIconsIconName;
};

/**
 * Supported icon families.
 *
 * - `material-community` — Material Design Icons (community)
 * - `ionicons`           — Ionicons
 * - `material`            — Material Icons (Google)
 */
export type IconFamily = keyof IconFamilyMap;

/**
 * Props for the unified {@link Icon} component.
 *
 * @template F - The icon family (defaults to `'material-community'`).
 * @param family - Which icon family to use (default `'material-community'`).
 * @param name   - Name of the glyph within the chosen family — type-checked
 *                 against the family's glyph map for autocomplete and safety.
 * @param size   - Icon size in dp (default `24`).
 * @param color  - Icon colour (default `'#111827'` / gray-900).
 */
export type IconProps<F extends IconFamily = 'material-community'> = {
  family?: F;
  name: IconFamilyMap[F];
  size?: number;
  color?: string;
};

/**
 * Maps an {@link IconFamily} to the corresponding `@react-native-vector-icons/*`
 * component.
 */
const ICON_COMPONENTS: Record<IconFamily, React.ComponentType<any>> = {
  'material-community': MaterialCommunityIcons,
  ionicons: Ionicons,
  material: MaterialIcons,
};

/**
 * A unified icon component that wraps `@react-native-vector-icons/*` and
 * provides a consistent colour/sizing API across all icon families.
 *
 * The `name` prop is fully typed per family — you get autocomplete for the
 * correct glyph names in your editor.
 *
 * All icons in the app should use this component instead of importing
 * directly from `@react-native-vector-icons/*` — this ensures every icon
 * honours the same default colour and size conventions.
 *
 * @example
 * ```tsx
 * // MaterialCommunityIcons (default family) — names are autocompleted
 * <Icon name="home" size={24} color="#2563EB" />
 *
 * // Ionicons
 * <Icon family="ionicons" name="chevron-down" size={18} color="#636363" />
 *
 * // MaterialIcons
 * <Icon family="material" name="settings" size={20} color="#64748B" />
 * ```
 */
export const Icon = <F extends IconFamily = 'material-community'>({
  family = 'material-community' as F,
  name,
  size = 24,
  color = '#111827',
}: IconProps<F>) => {
  const VectorIcon: React.ComponentType<{ name: string; size?: number; color?: string }> =
    ICON_COMPONENTS[family];
  return <VectorIcon name={name as string} size={size} color={color} />;
};
