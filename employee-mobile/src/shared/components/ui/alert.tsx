import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { Text } from './text';
import { cn } from '../../utils/cn';

const alertVariants = cva(
  'relative w-full rounded-2xl border p-4 flex-row items-start gap-x-3',
  {
    variants: {
      variant: {
        default: 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800',
        destructive: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps extends ViewProps, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

/**
 * Alert Component for inline feedback and status messages.
 */
const Alert = React.forwardRef<View, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => (
    <View
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}>
      {icon && <View className="mt-0.5">{icon}</View>}
      <View className="flex-1 gap-y-1">{children}</View>
    </View>
  )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<View, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View ref={ref} {...props}>
      <Text 
        variant="heading" 
        size="sm" 
        weight="semibold" 
        className={cn('leading-tight', className)} 
      />
    </View>
  )
);
AlertTitle.displayName = 'AlertTitle';

// Simplified Title helper for direct text use
const AlertTitleText = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <Text 
    variant="heading" 
    size="sm" 
    weight="semibold" 
    className={cn('leading-none tracking-tight mb-1', className)}>
    {children}
  </Text>
);

const AlertDescription = React.forwardRef<View, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View ref={ref} {...props}>
      <Text 
        variant="subtext" 
        size="xs" 
        className={cn('leading-relaxed opacity-90', className)} 
      />
    </View>
  )
);
AlertDescription.displayName = 'AlertDescription';

// Simplified Description helper for direct text use
const AlertDescriptionText = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <Text 
    variant="subtext" 
    size="xs" 
    className={cn('leading-normal', className)}>
    {children}
  </Text>
);

export { Alert, AlertTitleText as AlertTitle, AlertDescriptionText as AlertDescription };
