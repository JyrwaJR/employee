import React, { createContext, useContext, useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

const AnimationContext = createContext<{ start: boolean; stagger: number }>({ 
  start: false, 
  stagger: 0 
});

/**
 * Orchestrates entrance animations. 
 * Can be linked to a Skeleton state or triggered on mount.
 */
export const AnimationProvider = ({ 
  children, 
  start = true, 
  stagger = 100 
}: { 
  children: React.ReactNode; 
  start?: boolean; 
  stagger?: number;
}) => (
  <AnimationContext.Provider value={{ start, stagger }}>
    {children}
  </AnimationContext.Provider>
);

export const useAnimation = () => useContext(AnimationContext);

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  translateY?: number;
  className?: string;
  /** Index for automatic stagger calculation */
  index?: number;
}

/**
 * A reusable entrance animation component.
 * Automatically respects the AnimationProvider state.
 */
export const FadeInView = ({ 
  children, 
  duration = 600, 
  delay = 0, 
  translateY = 15,
  className,
  index = 0
}: FadeInViewProps) => {
  const { start, stagger } = useAnimation();
  const opacity = useSharedValue(0);
  const offset = useSharedValue(translateY);

  useEffect(() => {
    if (start) {
      const finalDelay = delay + (index * stagger);
      
      opacity.value = withDelay(
        finalDelay, 
        withTiming(1, { duration, easing: Easing.out(Easing.quad) })
      );
      
      offset.value = withDelay(
        finalDelay, 
        withTiming(0, { duration, easing: Easing.out(Easing.quad) })
      );
    } else {
      opacity.value = 0;
      offset.value = translateY;
    }
  }, [start, delay, index, stagger, duration, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};
