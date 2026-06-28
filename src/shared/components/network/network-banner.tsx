import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnlineStatus } from '@hooks';

const BANNER_HEIGHT = 32;
const DEBOUNCE_MS = 1000; // 1s debounce to avoid flicker on flaky connections

/**
 * A subtle status bar that appears at the top of the screen when the device
 * loses network connectivity.
 *
 * - Shows "You are offline" on an amber background.
 * - Animates in/out using react-native-reanimated.
 * - 1-second debounce to prevent flickering during brief disconnects.
 * - Renders below the safe area inset so it doesn't overlap the status bar.
 *
 * @example
 * ```tsx
 * <NetworkBanner />
 * ```
 */
export const NetworkBanner = () => {
  const { isOnline } = useOnlineStatus();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-BANNER_HEIGHT);
  const debouncedOffline = useDebouncedValue(!isOnline, DEBOUNCE_MS);

  useEffect(() => {
    translateY.value = withTiming(debouncedOffline ? 0 : -BANNER_HEIGHT, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [debouncedOffline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!debouncedOffline) {
    // Return null when online to remove from the render tree
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle, { top: insets.top }]}>
      <Animated.Text style={styles.text}>You are offline</Animated.Text>
    </Animated.View>
  );
};

/** Simple debounce hook — waits `delay` ms before committing the value. */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    backgroundColor: '#F59E0B', // amber-500
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
