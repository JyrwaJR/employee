import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

/**
 * Supported icon families from `@expo/vector-icons`.
 */
export type IconFamily = 'material-community' | 'ionicons' | 'material';

/**
 * Props for the unified {@link Icon} component.
 *
 * @param family - Which icon family to use (default `'material-community'`).
 * @param name   - Name of the glyph within the chosen family.
 * @param size   - Icon size in dp (default `24`).
 * @param color  - Icon colour (default `'#111827'` / gray-900).
 */
export type IconProps = {
  family?: IconFamily;
  name: string;
  size?: number;
  color?: string;
};

/**
 * Maps an {@link IconFamily} to the corresponding `@expo/vector-icons` component.
 *
 * Each vector-icon component has a different `name` prop type, so we use a
 * common `any` here — type safety for the `name` string is provided at the
 * call site by the individual icon-family glyph maps.
 */

const ICON_COMPONENTS: Record<IconFamily, React.ComponentType<any>> = {
  'material-community': MaterialCommunityIcons,
  ionicons: Ionicons,
  material: MaterialIcons,
};

/**
 * A unified icon component that wraps `@expo/vector-icons` and provides a
 * consistent colour/sizing API across all icon families.
 *
 * All icons in the app should use this component instead of importing
 * directly from `@expo/vector-icons` — this ensures every icon honours the
 * same default colour and size conventions.
 *
 * @example
 * ```tsx
 * // MaterialCommunityIcons (default family)
 * <Icon name="home" size={24} color="#2563EB" />
 *
 * // Ionicons
 * <Icon family="ionicons" name="chevron-down" size={18} color="#636363" />
 *
 * // MaterialIcons
 * <Icon family="material" name="settings" size={20} color="#64748B" />
 * ```
 */
export const Icon = ({
  family = 'material-community',
  name,
  size = 24,
  color = '#111827',
}: IconProps) => {
  const VectorIcon = ICON_COMPONENTS[family];
  return <VectorIcon name={name} size={size} color={color} />;
};
