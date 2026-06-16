import React, { memo, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useRouter, useNavigation, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/shared/hooks/use-theme';
import { Text } from '@/src/shared/components/ui/text';
import { cn } from '@/src/shared/utils/helpers/cn';

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /**
   * Main title of the header. Can be a string or a custom React node.
   */
  title?: string | React.ReactNode;
  /**
   * Optional subtitle shown below the title.
   */
  subtitle?: string;
  /**
   * Custom component for the left section.
   */
  leftIcon?: React.ReactNode;
  /**
   * Custom component for the right section.
   */
  rightIcon?: React.ReactNode;
  /**
   * Explicitly show or hide the back button.
   * If undefined, it will show if the navigation stack has a history.
   */
  showBackButton?: boolean;
  /**
   * Custom callback for the back button.
   * Default: router.back()
   */
  onBackPress?: () => void;
  /**
   * Custom component to replace the entire center (title) section.
   */
  centerComponent?: React.ReactNode;
  /**
   * Custom icon name for the back button (Ionicons).
   * Default: 'chevron-back'
   */
  backIconName?: keyof typeof Ionicons.glyphMap;
  /**
   * Style for the outermost container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content view (excluding safe area padding).
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the title text.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * If true, removes the bottom border.
   */
  hideBottomBorder?: boolean;
  /**
   * Custom background color.
   */
  backgroundColor?: string;
  /**
   * Optional className for tailwind styling.
   */
  className?: string;
}

/**
 * A highly customizable and optimized Header component.
 * Uses SafeAreaInsets for proper spacing on devices with notches.
 */
export const Header = memo(
  ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    showBackButton,
    onBackPress,
    centerComponent,
    backIconName = 'chevron-back',
    containerStyle,
    contentStyle,
    titleStyle,
    hideBottomBorder = false,
    className,
  }: HeaderProps) => {
    const router = useRouter();
    const navigation = useNavigation();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const canGoBack = navigation.canGoBack();
    const shouldShowBack = showBackButton ?? canGoBack;

    const handleBack = useCallback(() => {
      if (onBackPress) {
        onBackPress();
      } else {
        router.back();
      }
    }, [onBackPress, router]);

    const headerStyle = useMemo(
      () => [
        {
          paddingTop: insets.top,
        },
        containerStyle,
      ],
      [insets.top, containerStyle]
    );

    return (
      <View
        className={cn(
          'bg-white dark:bg-slate-950',
          !hideBottomBorder && 'border-b border-gray-200 dark:border-gray-800',
          className
        )}
        style={headerStyle}>
        <View
          className="min-h-[56px] flex-row items-center justify-between px-4 py-3"
          style={contentStyle}>
          {/* Left Section */}
          <View className="flex-1 flex-row items-center justify-start">
            {shouldShowBack && (
              <TouchableOpacity
                onPress={handleBack}
                className="mr-3"
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                activeOpacity={0.7}>
                <Ionicons
                  name={backIconName}
                  size={24}
                  color={theme === 'dark' ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
            )}
            {leftIcon}
          </View>

          {/* Center Section (Title/Subtitle) */}
          <View className="flex-[3] items-center justify-center">
            {centerComponent ? (
              centerComponent
            ) : (
              <>
                {typeof title === 'string' ? (
                  <Text
                    variant="heading"
                    size="lg"
                    weight="semibold"
                    numberOfLines={1}
                    style={titleStyle}>
                    {title}
                  </Text>
                ) : (
                  title
                )}
                {subtitle && (
                  <Text variant="subtext" size="xs" numberOfLines={1} className="mt-0.5">
                    {subtitle}
                  </Text>
                )}
              </>
            )}
          </View>

          {/* Right Section */}
          <View className="flex-1 flex-row items-center justify-end">{rightIcon}</View>
        </View>
      </View>
    );
  }
);

Header.displayName = 'Header';

/**
 * A wrapper for Stack.Screen that easily integrates the custom Header.
 */
export const HeaderStack = (props: HeaderProps) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        header: () => <Header {...props} />,
      }}
    />
  );
};
