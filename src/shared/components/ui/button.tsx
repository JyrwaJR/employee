import { cn } from '@utils/helpers/cn';
import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useDelay } from '@hooks/use-delay';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'flex-row disabled:opacity-70 items-center justify-center rounded-2xl shadow-sm',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600',
        secondary: 'bg-slate-100 dark:bg-slate-800 shadow-none',
        outline: 'border border-gray-400 bg-background shadow-none dark:border-gray-800',
        ghost: 'bg-background !shadow-none',
        destructive: 'bg-red-500',
      },
      size: {
        default: 'py-4 px-4',
        sm: 'py-2 px-3',
        lg: 'py-5 px-8',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  onPress: () => void;
  title?: string;
  isLoading?: boolean;
  loadingDelay?: number;
  children?: React.ReactNode;
}

export const Button = ({
  onPress,
  className,
  title,
  variant = 'primary',
  size = 'default',
  isLoading,
  testID,
  loadingDelay = 2000,
  children,
  ...props
}: ButtonProps) => {
  const { trigger, isDelayed } = useDelay(loadingDelay);
  const isDisabled = isDelayed || isLoading || props.disabled;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => {
        trigger();
        onPress();
      }}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={cn(buttonVariants({ variant, size, className }), isLoading && 'opacity-70')}
      {...props}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#FFF'} />
      ) : (
        <>
          {children || (
            <Text
              className={cn(
                'text-base font-semibold',
                variant === 'outline' || variant === 'ghost' || variant === 'secondary'
                  ? 'text-slate-900 dark:text-slate-50'
                  : '!dark:text-black text-white'
              )}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

Button.displayName = 'Button';
