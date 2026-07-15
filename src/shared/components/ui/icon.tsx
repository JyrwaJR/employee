import Ionicons, { type IoniconsIconName } from '@react-native-vector-icons/ionicons';

/**
 * Props for the {@link Icon} component.
 *
 * @param name  - Name of the Ionicons glyph — fully typed for autocomplete.
 * @param size  - Icon size in dp (default `24`).
 * @param color - Icon colour (default `'#111827'` / gray-900).
 */
export type IconProps = {
  name: IoniconsIconName;
  size?: number;
  color?: string;
};

/**
 * A type-safe icon component that wraps `@react-native-vector-icons/ionicons`.
 *
 * The `name` prop is fully typed against Ionicons' glyph map so your editor
 * provides autocomplete for valid icon names.
 *
 * Every icon in the app should use this component instead of importing
 * directly from `@react-native-vector-icons/ionicons` — this ensures a
 * consistent default colour and size across the codebase.
 *
 * @example
 * ```tsx
 * <Icon name="chevron-down" size={18} color="#636363" />
 * <Icon name="home" size={24} color="#2563EB" />
 * <Icon name="alert-circle-outline" size={48} color="#ef4444" />
 * ```
 */
export const Icon = ({ name, size = 24, color = '#111827' }: IconProps) => {
  return <Ionicons name={name} size={size} color={color} />;
};
