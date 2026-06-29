import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/helpers';

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
 * Optional `size` and `weight` overrides are also available for edge cases
 * that don't map cleanly to a single variant.
 *
 * @example
 * ```tsx
 * <Text variant="display-xxl">Hero Headline</Text>
 * <Text variant="body-md">Default body copy.</Text>
 * <Text variant="link-md">See details →</Text>
 * <Text variant="caption-sm">Legal disclaimer</Text>
 * ```
 */
const Text = React.forwardRef<RNText, TextProps>(
  ({ className, variant, size, weight, ...props }, ref) => {
    return (
      <RNText
        className={cn(textVariants({ variant, size, weight, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
