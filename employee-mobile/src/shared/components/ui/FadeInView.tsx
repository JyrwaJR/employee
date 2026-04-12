import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing,
  useAnimatedScrollHandler
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface AnimationContextType {
  start: boolean;
  stagger: number;
  scrollOffset: Animated.SharedValue<number>;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const AnimationProvider = ({ 
  children, 
  start = true, 
  stagger = 100 
}: { 
  children: React.ReactNode; 
  start?: boolean; 
  stagger?: number;
}) => {
  const scrollOffset = useSharedValue(0);

  return (
    <AnimationContext.Provider value={{ start, stagger, scrollOffset }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) throw new Error('useAnimation must be used within AnimationProvider');
  return context;
};

/* -------------------------------------------------------------------------- */
/*                                Scroll Handler                              */
/* -------------------------------------------------------------------------- */

export const useAnimationScrollHandler = () => {
  const { scrollOffset } = useAnimation();
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  translateY?: number;
  className?: string;
  index?: number;
  viewportAware?: boolean;
}

/**
 * High-performance entrance animation.
 * Optimized with Easing.bezier and direct UI-thread transitions.
 */
export const FadeInView = ({ 
  children, 
  duration = 700, 
  delay = 0, 
  translateY = 25,
  className,
  index = 0,
  viewportAware = false
}: FadeInViewProps) => {
  const { start, stagger, scrollOffset } = useAnimation();
  const opacity = useSharedValue(0);
  const offset = useSharedValue(translateY);
  const [isVisible, setIsVisible] = useState(!viewportAware);
  const [layoutY, setLayoutY] = useState(0);

  const onLayout = (event: any) => {
    if (viewportAware) {
      setLayoutY(event.nativeEvent.layout.y);
    }
  };

  useEffect(() => {
    if (viewportAware && start && !isVisible) {
      const checkVisibility = () => {
        // Trigger slightly before it enters the viewport for smoothness
        if (layoutY < (scrollOffset.value + SCREEN_HEIGHT + 100)) {
          setIsVisible(true);
        }
      };
      
      const interval = setInterval(checkVisibility, 50);
      return () => clearInterval(interval);
    }
  }, [viewportAware, start, layoutY, isVisible, scrollOffset]);

  useEffect(() => {
    if (start && isVisible) {
      const finalDelay = delay + (index * stagger);
      
      // Use Beizer curve for a more "premium" feel than quad/cubic
      const config = {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      };

      opacity.value = withDelay(finalDelay, withTiming(1, config));
      offset.value = withDelay(finalDelay, withTiming(0, config));
    }
  }, [start, isVisible, delay, index, stagger, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View 
      onLayout={onLayout}
      style={animatedStyle} 
      className={className}
    >
      {children}
    </Animated.View>
  );
};
