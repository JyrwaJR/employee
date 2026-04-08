import React from 'react';
import { Modal, View, Pressable, ViewProps } from 'react-native';
import { Text } from './text';
import { cn } from '../../utils/cn';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Dialog Root Component
 */
export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}>
      {children}
    </Modal>
  );
};

interface DialogContentProps extends ViewProps {
  onClose?: () => void;
}

/**
 * The overlay box that contains the dialog content.
 */
export const DialogContent = ({ children, className, onClose, ...props }: DialogContentProps) => {
  return (
    <Pressable 
      onPress={onClose}
      className="flex-1 items-center justify-center bg-black/60 px-4 dark:bg-slate-950/80">
      <Pressable 
        onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className={cn(
          'w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900',
          className
        )}
        {...props}>
        {children}
      </Pressable>
    </Pressable>
  );
};

export const DialogHeader = ({ className, ...props }: ViewProps) => (
  <View className={cn('mb-4 gap-y-1', className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: ViewProps) => (
  <View className={cn('mt-6 flex-row justify-end gap-x-3', className)} {...props} />
);

export const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof Text>) => (
  <Text variant="heading" size="xl" weight="semibold" className={className} {...props} />
);

export const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof Text>) => (
  <Text variant="subtext" size="sm" className={className} {...props} />
);
