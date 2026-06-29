import * as React from 'react';
import { View, ViewProps, Text as RNText } from 'react-native';
import { Text } from './text';
import { cn } from '../../utils/helpers/cn';

/**
 * Card container following HP design system.
 *
 * Uses `{rounded.xl}` (16px) corners, `{colors.canvas}` background,
 * and Soft Lift elevation (`shadow-sm`). Padding defaults to
 * `{spacing.xl}` (24px) as the standard card internal spacing.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>Details here</CardContent>
 *   <CardFooter>
 *     <Button title="Buy now" onPress={handleBuy} />
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('rounded-xl bg-card shadow-sm', className)} {...props} />
));

Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

/**
 * Card title using `{typography.display-xs}` (20px/500) weight per HP spec.
 */
const CardTitle = React.forwardRef<RNText, React.ComponentProps<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} variant="display-xs" className={cn('leading-tight', className)} {...props} />
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * Card description using muted foreground color.
 */
const CardDescription = React.forwardRef<RNText, React.ComponentProps<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      variant="caption-md"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-row items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
