import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { cn } from '../../utils/cn';

interface KeyboardSafeViewProps {
  children: React.ReactNode;
  /**
   * Tailwind class for the innermost container
   */
  className?: string;
  /**
   * Tailwind class for the ScrollView content container
   */
  contentContainerClassName?: string;
  /**
   * Whether to wrap content in a SafeAreaView. Defaults to true.
   */
  useSafeArea?: boolean;
  /**
   * Edges to be handled by SafeAreaView. Defaults to ['bottom', 'left', 'right'].
   */
  safeAreaEdges?: Edge[];
  /**
   * Whether tapping the background should dismiss the keyboard. Defaults to true.
   */
  dismissKeyboardOnTap?: boolean;
  /**
   * Additional offset for KeyboardAwareScrollView
   */
  extraScrollHeight?: number;
  /**
   * Whether to enable the scroll view. If false, it acts as a simple keyboard-aware View.
   */
  scrollEnabled?: boolean;
}

/**
 * A production-ready shared component for handling keyboard interactions.
 * Styled with Nativewind (Tailwind CSS) for project consistency.
 *
 * IMPORTANT: Layout classes like 'justify-center' or 'items-center' MUST be
 * passed to 'contentContainerClassName', not 'className'.
 */
export const KeyboardSafeView: React.FC<KeyboardSafeViewProps> = ({
  children,
  className = '',
  contentContainerClassName = '',
  useSafeArea = true,
  safeAreaEdges = ['bottom', 'left', 'right'],
  dismissKeyboardOnTap = true,
  extraScrollHeight = 20,
  scrollEnabled = true,
}) => {
  const Container = useSafeArea ? SafeAreaView : View;

  const content = (
    <KeyboardAwareScrollView
      className={cn('flex-1', className)}
      contentContainerClassName={cn('flex-grow', contentContainerClassName)}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={extraScrollHeight}
      scrollEnabled={scrollEnabled}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      {children}
    </KeyboardAwareScrollView>
  );

  if (dismissKeyboardOnTap) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container edges={safeAreaEdges} className="flex-1 bg-white dark:bg-slate-950">
          {content}
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <Container edges={safeAreaEdges} className="flex-1 bg-white dark:bg-slate-950">
      {content}
    </Container>
  );
};
