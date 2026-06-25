import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import { StackHeader } from './stack-header';

interface StackHeaderLayoutProps {
  children?: React.ReactNode;
}

export const StackHeaderLayout = ({ children }: StackHeaderLayoutProps) => (
  <View className="flex-1 bg-white dark:bg-slate-950">
    <StackHeader />
    {children ?? <Slot />}
  </View>
);
