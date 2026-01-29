import { cn } from '@/src/libs/cn';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

// --- Types ---
interface LoadingScreenProps {
  message?: string;
  variant?: 'light' | 'dark'; // Support for dark mode
}

const { width } = Dimensions.get('window');

export const LoadingScreen = ({
  message = 'Loading...',
  variant = 'light',
}: LoadingScreenProps) => {
  const isDark = variant === 'dark';

  // Animation Values
  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(0.8);
  const progressWidth = useSharedValue(0);

  // 1. Breathing Logo Effect
  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );

    logoOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.8, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  // 2. Indeterminate Progress Bar
  useEffect(() => {
    progressWidth.value = withRepeat(
      withSequence(
        withTiming(width * 0.6, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 0 }) // Reset instantly
      ),
      -1,
      false
    );
  }, []);

  // Animated Styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
    opacity: withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 1000 })),
  }));

  return (
    <View className={cn('flex-1 items-center justify-center', isDark ? 'bg-gray-950' : 'bg-white')}>
      {/* --- Central Logo / Icon --- */}
      <Animated.View style={logoStyle} className="mb-10 items-center justify-center">
        <View
          className={cn(
            'h-20 w-20 items-center justify-center rounded-3xl shadow-sm',
            isDark ? 'bg-gray-800' : 'border border-gray-100 bg-gray-50'
          )}>
          {/* Replace this Text with your App Logo SVG */}
          <Text className="text-4xl">✨</Text>
        </View>
      </Animated.View>

      {/* --- Progress Bar Container --- */}
      <View className="mb-6 h-1 w-48 overflow-hidden rounded-full bg-gray-100">
        {/* The Moving Bar */}
        <Animated.View
          style={[styles.progressBar, progressBarStyle]}
          className={cn('h-full rounded-full', isDark ? 'bg-white' : 'bg-gray-900')}
        />
      </View>

      {/* --- Message Text --- */}
      {/* Uses Reanimated Layout Transitions for smooth text updates */}
      <Animated.Text
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(200)}
        className={cn(
          'text-sm font-medium tracking-wide',
          isDark ? 'text-gray-400' : 'text-gray-400'
        )}>
        {message}
      </Animated.Text>

      {/* --- Footer / Version --- */}
      <View className="absolute bottom-12">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
          Secure Environment
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    // NativeWind handles most, but specific animated widths can be cleaner here if needed
  },
});
