import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/helpers';

/**
 * Font-size token classes defined in `tailwind.config.js` `theme.extend.fontSize`.
 * Each token bundles `font-size`, `line-height`, and `font-weight` as a single
 * Tailwind utility class.
 */
const TEXT_SIZE_CLASSES = [
  'text-display-xxl',
  'text-display-xl',
  'text-display-lg',
  'text-display-md',
  'text-display-sm',
  'text-display-xs',
  'text-body-lg',
  'text-body-md',
  'text-body-emphasis',
  'text-caption-md',
  'text-caption-bold',
  'text-caption-sm',
  'text-link-md',
  'text-button-md',
  'text-button-sm',
  'text-price-md',
] as const;

/** Set-lookup for O(1) membership checks. */
const TEXT_SIZE_SET = new Set<string>(TEXT_SIZE_CLASSES);

/**
 * Strips all text-size token classes from a space-separated class string.
 * Used when the `size` prop is explicitly provided so that `size` becomes
 * the single source of truth for font sizing.
 *
 * @param classes - Raw class string (e.g. `"text-display-sm font-semibold"`).
 * @returns The class string with any text-size tokens removed.
 */
function withoutTextSize(classes: string): string {
  return classes
    .split(' ')
    .filter((cls) => !TEXT_SIZE_SET.has(cls))
    .join(' ');
}

/**
 * HP Design System typography variants.
 *
 * Uses the DESIGN.md token hierarchy:
 * - `display-*`: Headlines at weight 500 (hero → inline list headers)
 * - `body-*`: Body copy at weight 400 (lead paragraphs → default body)
 * - `body-emphasis`: Bolded run-in copy at weight 500
 * - `caption-*`: Metadata and fine print at weight 400/700
 * - `link-md`: Inline link emphasis at weight 500
 * - `button-*`: Button labels at weight 600/700 with letter-spacing
 * - `price-md`: Tier and product price stamps at weight 500
 *
 * @remarks
 * When both `variant` and `size` are provided, the `Text` component strips
 * text-size classes from the `variant` output so that `size` controls font
 * sizing. See the `Text` component for details.
 */
const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      /* Display — all weight 500 */
      'display-xxl': 'text-display-xxl',
      'display-xl': 'text-display-xl',
      'display-lg': 'text-display-lg',
      'display-md': 'text-display-md',
      'display-sm': 'text-display-sm',
      'display-xs': 'text-display-xs',
      /* Body */
      'body-lg': 'text-body-lg',
      'body-md': 'text-body-md',
      'body-emphasis': 'text-body-emphasis',
      /* Caption */
      'caption-md': 'text-caption-md',
      'caption-bold': 'text-caption-bold',
      'caption-sm': 'text-caption-sm',
      /* Special */
      'link-md': 'text-link-md text-primary',
      'button-md': 'text-button-md uppercase tracking-wide',
      'button-sm': 'text-button-sm uppercase tracking-wider',
      'price-md': 'text-price-md',

      /* Semantic shorthand — mapped to HP tokens */
      default: 'text-body-md',
      heading: 'text-display-sm font-semibold',
      subtext: 'text-caption-md text-muted-foreground',
      error: 'text-caption-md text-destructive',
      link: 'text-link-md text-primary',
      label: 'text-caption-md font-medium text-foreground/70',
    },
    size: {
      default: '',
      xs: 'text-caption-sm',
      sm: 'text-caption-md',
      lg: 'text-body-lg',
      xl: 'text-display-xs',
      '2xl': 'text-display-sm',
      '3xl': 'text-display-md',
    },
    weight: {
      default: '',
      light: 'font-light',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  className?: string;
}

/**
 * Typographic component backed by the HP Design System.
 *
 * Provides every DESIGN.md token as a `variant`:
 * `display-xxl` (72px) → `caption-sm` (12px), `body-*`, `link-md`,
 * `button-*`, `price-md`, plus semantic shorthands (`heading`, `subtext`, etc.).
 *
 * **`size` overrides `variant` sizing.** When the `size` prop is explicitly
 * provided, any text-size token class from `variant` is stripped so that
 * `size` becomes the single source of truth for font sizing. This avoids
 * conflicting `text-*` classes on the same element.
 *
 * Optional `weight` provide fine-grained control over font weight.
 *
 * @example
 * ```tsx
 * <Text variant="display-xxl">Hero Headline</Text>
 * <Text variant="body-md">Default body copy.</Text>
 * <Text variant="heading" size="lg">Card heading at body-large size</Text>
 * <Text variant="subtext" size="xs">Fine-print metadata</Text>
 * <Text variant="link-md">See details →</Text>
 * <Text variant="caption-sm">Legal disclaimer</Text>
 * ```
 */
const Text = React.forwardRef<RNText, TextProps>(
  ({ className, variant, size, weight, ...props }, ref) => {
    const variantClasses = textVariants({ variant, weight });
    const resolved =
      size !== undefined
        ? cn(withoutTextSize(variantClasses), textVariants({ size }), className)
        : cn(variantClasses, className);

    return <RNText className={resolved} ref={ref} {...props} />;
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
