import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@components/ui/icon';
import { Text } from '@components/ui/text';
import { Route, router } from 'expo-router';
import { HOME_QUICK_ACTIONS } from '@features/home/utils/constants';

/** Displays a horizontal row of quick-action shortcut buttons. */
export const HomeQuickActions = () => {
  return (
    <View className="mx-6">
      <Text variant="heading" size="lg" className="mb-4 text-foreground">
        Quick Actions
      </Text>
      <View className="flex-row justify-between">
        {HOME_QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => action.route && router.push(action.route as Route)}
            activeOpacity={0.7}
            className="items-center">
            <View className="mb-2 h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
              <Icon name={action.icon as any} size={26} color="#024ad8" />
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
