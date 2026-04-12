import * as React from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './text';
import { cn } from '../../utils/cn';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const Accordion = ({ 
  children, 
  value, 
  onValueChange,
  className 
}: { 
  children: React.ReactNode; 
  value?: string; 
  onValueChange?: (value: string) => void;
  className?: string;
}) => (
  <AccordionContext.Provider value={{ value, onValueChange }}>
    <View className={cn('w-full', className)}>{children}</View>
  </AccordionContext.Provider>
);

const AccordionItem = ({ 
  children, 
  value: itemValue, 
  className 
}: { 
  children: React.ReactNode; 
  value: string; 
  className?: string;
}) => {
  const { value: activeValue } = React.useContext(AccordionContext);
  const isOpen = activeValue === itemValue;

  return (
    <View className={cn('border-b border-slate-200 dark:border-slate-800', className)}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, value: itemValue }) 
          : child
      )}
    </View>
  );
};

const AccordionTrigger = ({ 
  children, 
  isOpen, 
  value: itemValue,
  className 
}: { 
  children: React.ReactNode; 
  isOpen?: boolean; 
  value?: string;
  className?: string;
}) => {
  const { onValueChange, value: activeValue } = React.useContext(AccordionContext);
  
  const rotation = useDerivedValue(() => {
    return withTiming(isOpen ? 180 : 0, { duration: 300 });
  });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (onValueChange && itemValue) {
          onValueChange(activeValue === itemValue ? '' : itemValue);
        }
      }}
      className={cn('flex-row items-center justify-between py-4', className)}
    >
      <Text weight="medium" className="flex-1">{children}</Text>
      <Animated.View style={arrowStyle}>
        <Ionicons name="chevron-down" size={18} color="#64748b" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const AccordionContent = ({ 
  children, 
  isOpen,
  className 
}: { 
  children: React.ReactNode; 
  isOpen?: boolean;
  className?: string;
}) => {
  // We use LayoutAnimation for the height transition as it's more 
  // performant for "auto height" than measuring via Reanimated.
  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View className={cn('pb-4 pt-0', className)}>
      {children}
    </View>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
