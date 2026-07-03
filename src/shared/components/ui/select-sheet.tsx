import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { Icon } from '@components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './text';
import { cn } from '@utils/helpers/cn';
import { Ternary } from '@components/base';

/**
 * A single option shape for the {@link SelectSheet} component.
 */
export interface SelectSheetOption {
  /** Human-readable label shown in the option list. */
  label: string;
  /** The underlying value returned when this option is selected. */
  value: string;
  /** Optional secondary text rendered below the label. */
  subtitle?: string;
}

interface SelectSheetProps {
  /** Label text displayed above the trigger. */
  label?: string;
  /** Placeholder text shown when `selectedValue` is empty or no match is found. */
  placeholder?: string;
  /** Title displayed at the top of the opened sheet. Defaults to "Select". */
  title?: string;
  /** The list of available options. */
  options: SelectSheetOption[];
  /** The currently selected value. */
  selectedValue: string;
  /** Called when the user selects an option. Receives the option's `value`. */
  onSelect: (value: string) => void;
  /** Optional validation error message shown below the trigger. */
  error?: string;

  disabled?: boolean;

  refetch?: () => void;
}

/**
 * A slide-up bottom-sheet option picker.
 *
 * Renders a tappable trigger button (styled to match {@link Input}) that opens
 * a modal sheet sliding up from the bottom with a scrollable list of options.
 * The active selection is highlighted with a blue accent and a checkmark icon.
 *
 * Uses `react-native-reanimated` for smooth spring-based entrance and timed
 * exit animations.
 *
 * @example
 * ```tsx
 * <SelectSheet
 *   label="Country"
 *   placeholder="Choose a country"
 *   title="Select Country"
 *   options={[
 *     { label: 'United States', value: 'US', subtitle: '+1' },
 *     { label: 'Canada', value: 'CA', subtitle: '+1' },
 *   ]}
 *   selectedValue={country}
 *   onSelect={setCountry}
 *   error={errors.country?.message}
 * />
 * ```
 */
export const SelectSheet = (props: SelectSheetProps) => {
  const {
    label,
    placeholder = 'Select an option',
    title = 'Select',
    options,
    selectedValue,
    onSelect,
    error,
    disabled,
    refetch,
  } = props;
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      setOpen(false);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayText = selectedOption?.label ?? placeholder;

  return (
    <View className="my-2 w-full">
      {label && (
        <Text variant={error ? 'error' : 'label'} weight="medium" className="mb-2 ml-1">
          {label}
        </Text>
      )}

      {/* Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        disabled={disabled}
        className={cn(
          'min-h-[44px] w-full flex-row items-center justify-between rounded-md border bg-background px-4',
          error ? 'border-destructive bg-destructive/5' : 'border-input'
        )}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Field'}: ${displayText}. Tap to change.`}>
        <Text
          weight={selectedOption ? 'semibold' : 'default'}
          className={cn(
            'flex-1 text-body-md',
            selectedOption ? 'text-foreground' : 'text-muted-foreground'
          )}>
          {displayText}
        </Text>
        <Icon family="ionicons" name="chevron-down" size={18} color="#9ca3af" />
      </TouchableOpacity>

      {error && (
        <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
          {error}
        </Text>
      )}

      {/* Bottom Sheet */}
      <SelectSheetModal
        open={open}
        title={title}
        options={options}
        selectedValue={selectedValue}
        onSelect={handleSelect}
        onClose={handleClose}
        refetch={refetch}
      />
    </View>
  );
};

/**
 * Internal bottom-sheet modal rendered inside a React Native `Modal`.
 * Separated from {@link SelectSheet} so the animation state resets properly
 * each time the modal opens (remount on `open` toggle).
 */
type SelectSheetModalProps = {
  open: boolean;
  title: string;
  options: SelectSheetOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  isLoading?: boolean;
  refetch?: () => void;
};

const SelectSheetModal = (props: SelectSheetModalProps) => {
  const { open, title, options, selectedValue, onSelect, onClose, refetch } = props;
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (open) {
      progress.value = withSpring(1, {
        damping: 25,
        stiffness: 200,
        mass: 0.9,
      });
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [600, 0], Extrapolate.CLAMP),
      },
    ],
  }));

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]} className="bg-black/50">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet Container */}
      <View style={StyleSheet.absoluteFill} className="pointer-events-box-none justify-end">
        <Animated.View style={[sheetStyle]} className="rounded-lg bg-background pb-2">
          {/* Handle bar */}
          <View className="items-center py-3">
            <View className="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          </View>

          {/* Title */}
          <Text variant="body-lg" weight="medium" className="px-5 pb-4">
            {title}
          </Text>

          {/* Options / Empty State */}
          <ScrollView
            className="max-h-96"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
            <Ternary
              condition={options.length === 0}
              ifTrue={
                <View className="items-center justify-center px-5 py-10">
                  <Icon
                    family="ionicons"
                    name="information-circle-outline"
                    size={32}
                    color="#9ca3af"
                  />
                  <Text className="mt-3 text-center text-muted-foreground">
                    No options available
                  </Text>
                  {refetch && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={refetch}
                      className="mt-4 flex-row items-center gap-x-2 rounded-lg bg-blue-50 px-6 py-2.5 dark:bg-blue-900/20">
                      <Icon family="ionicons" name="refresh" size={18} color="#3b82f6" />
                      <Text weight="semibold" className="text-blue-600 dark:text-blue-400">
                        Retry
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
              ifFalse={options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    activeOpacity={0.6}
                    onPress={() => {
                      runOnJS(onSelect)(option.value);
                    }}
                    className={cn(
                      'mx-3 flex-row items-center justify-between rounded-xl border border-transparent px-4 py-4',
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'active:bg-gray-50 dark:active:bg-gray-800'
                    )}
                    accessibilityRole="button"
                    accessibilityLabel={`${option.label}${isSelected ? ', selected' : ''}`}>
                    <View className="flex-1">
                      <Text
                        weight={isSelected ? 'semibold' : 'medium'}
                        className={cn(
                          'text-base',
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-gray-100'
                        )}>
                        {option.label}
                      </Text>
                      {option.subtitle && (
                        <Text
                          variant="caption-sm"
                          className={
                            isSelected
                              ? 'text-blue-500/70 dark:text-blue-400/70'
                              : 'text-gray-500 dark:text-gray-400'
                          }>
                          {option.subtitle}
                        </Text>
                      )}
                    </View>
                    {isSelected ? (
                      <Icon family="ionicons" name="checkmark-circle" size={22} color="#3b82f6" />
                    ) : (
                      <Icon family="ionicons" name="ellipse-outline" size={22} color="#d1d5db" />
                    )}
                  </TouchableOpacity>
                );
              })}
            />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};
