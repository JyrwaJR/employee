import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from '../ui/text';
import { cn } from '@utils/helpers/cn';

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

export const SearchInput = ({ containerClassName, ...props }: SearchInputProps) => (
  <View
    className={cn(
      'flex-row items-center rounded-2xl border border-border bg-surface-soft px-4 py-3',
      containerClassName
    )}>
    <Text className="mr-2 text-graphite">🔍</Text>
    <TextInput
      className="flex-1 text-base text-foreground"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </View>
);
