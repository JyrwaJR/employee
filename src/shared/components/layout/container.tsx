import React from 'react';
import { View } from 'react-native';
import { cn } from '@utils/helpers/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: Props) => {
  return <View className={cn('flex-1 bg-background p-2', className)}>{children}</View>;
};
