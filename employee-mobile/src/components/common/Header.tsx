import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../store/theme';

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showBackButton?: boolean;
}

export const Header = ({
  title,
  leftIcon,
  rightIcon,
  showBackButton,
}: HeaderProps) => {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBackButton ?? canGoBack;

  return (
    <View
      className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Left Section */}
        <View className="flex-1 flex-row justify-start items-center">
          {shouldShowBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme === 'dark' ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>
          )}
          {leftIcon}
        </View>

        {/* Center Section (Title) */}
        <View className="flex-[2] items-center justify-center">
          {title && (
            <Text className="text-lg font-semibold text-black dark:text-white" numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View className="flex-1 flex-row justify-end items-center">
          {rightIcon}
        </View>
      </View>
    </View>
  );
};

export const HeaderStack = ({
  title,
  leftIcon,
  rightIcon,
  showBackButton,
}: HeaderProps) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => <Header
          title={title}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          showBackButton={showBackButton}
        />,
      }}
    />
  );
}