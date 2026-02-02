import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const textVariants = cva(
    'text-black dark:text-slate-50',
    {
        variants: {
            variant: {
                default: 'text-base',
                heading: 'font-bold',
                subtext: 'text-gray-500 dark:text-slate-400',
                error: 'text-red-500 dark:text-red-500',
                link: 'text-blue-600',
                label: 'text-sm font-medium text-gray-700',
            },
            size: {
                default: 'text-base',
                xs: 'text-xs',
                sm: 'text-sm',
                lg: 'text-lg',
                xl: 'text-xl',
                '2xl': 'text-2xl',
                '3xl': 'text-3xl',
            },
            weight: {
                default: 'font-normal',
                light: 'font-light',
                medium: 'font-medium',
                semibold: 'font-semibold',
                bold: 'font-bold',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            weight: 'default',
        },
    }
);

export interface TextProps
    extends RNTextProps,
    VariantProps<typeof textVariants> {
    className?: string;
}

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
