import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  /**
   * Tailwind class for dimensions and border radius.
   * Example: 'h-10 w-full rounded-md'
   */
  className?: string;
  /**
   * Whether the pulse animation is active. Defaults to true.
   */
  animate?: boolean;
}

/**
 * A reusable Skeleton component for premium loading states.
 * Powered by React Native Reanimated for 60fps pulsing.
 */
export function Skeleton({ className, animate = true }: SkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (animate) {
      opacity.value = withRepeat(
        withSequence(withTiming(0.4, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1, // Infinite loop
        true // Reverse each loop
      );
    } else {
      opacity.value = 1;
    }
  }, [animate, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={cn('bg-zinc-200 dark:bg-zinc-800', className)}
      style={animatedStyle}
      accessibilityLabel="Loading..."
      accessible={false}
    />
  );
}
