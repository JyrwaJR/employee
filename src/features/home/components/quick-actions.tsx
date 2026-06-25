import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '@stores/theme.store';
import { Text } from '@components/ui/text';
import { Route, router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';

/** A single quick-action shortcut item. */
type QuickAction = {
  /** Display label. */
  label: string;
  /** MaterialCommunityIcons icon name. */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** App route to navigate to on press. */
  route: string;
};

/** Preset list of quick-action shortcuts. */
const ACTIONS: QuickAction[] = [
  { label: 'Apply Leave', icon: 'calendar-plus', route: PAGE_ROUTES.LEAVE },
  { label: 'View Salary', icon: 'currency-inr', route: PAGE_ROUTES.STATEMENT },
  { label: 'Attendance', icon: 'clipboard-check', route: '' },
  { label: 'Pension', icon: 'bank', route: PAGE_ROUTES.PENSION },
];

/** Displays a horizontal row of quick-action shortcut buttons. */
export const QuickActions = () => {
  const { theme } = useThemeStore();
  const iconColor = theme === 'dark' ? '#60A5FA' : '#3B82F6';

  return (
    <View className="mx-6">
      <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
        Quick Actions
      </Text>
      <View className="flex-row justify-between">
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => action.route && router.push(action.route as Route)}
            activeOpacity={0.7}
            className="items-center">
            <View className="mb-2 h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
              <MaterialCommunityIcons name={action.icon} size={26} color={iconColor} />
            </View>
            <Text variant="subtext" size="xs" className="text-center font-medium">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
