import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, UseControllerProps } from 'react-hook-form';
import { cn } from '@/src/libs/cn';

interface InputProps {
  control: UseControllerProps['control'];
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  label: string;
  className?: string;
}

export const ModernInput = ({
  control,
  className,
  name,
  placeholder,
  secureTextEntry,
  label,
}: InputProps) => {
  return (
    <View className={cn('mb-4', className)}>
      <Text className="mb-1.5 ml-1 text-sm font-medium text-gray-700">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              className={cn(
                'w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-base text-gray-900',
                'focus:border-blue-500 focus:bg-white', // Focus states (NativeWind v4+)
                error && 'border-red-500 bg-red-50/10'
              )}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
            />
            {error && (
              <Text className="ml-1 mt-1 text-xs font-medium text-red-500">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};
