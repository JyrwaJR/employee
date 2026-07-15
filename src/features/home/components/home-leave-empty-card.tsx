import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';

/** Empty-state card shown when the user has no upcoming leaves. */
export const HomeLeaveEmptyCard = () => (
  <Card>
    <CardContent className="p-5">
      <View className="flex-row items-center">
        <Icon name="calendar-number-outline" size={22} color="#636363" />
        <Text variant="subtext" className="ml-3 text-sm font-medium text-charcoal">
          No upcoming leaves
        </Text>
      </View>
    </CardContent>
  </Card>
);
