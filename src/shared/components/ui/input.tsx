import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@utils/helpers/cn';

interface InputProps extends TextInputProps {
  className?: string;
  error?: boolean;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, error, multiline, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground',
          'focus:border-ring',
          error && 'border-destructive bg-destructive/5',
          className
        )}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
