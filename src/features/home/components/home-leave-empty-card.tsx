import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/** Empty-state card shown when the user has no upcoming leaves. */
export const HomeLeaveEmptyCard = () => (
  <Card>
    <CardContent className="p-5">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="calendar-check" size={22} color="#9CA3AF" />
        <Text variant="subtext" className="ml-3 text-sm font-medium">
          No upcoming leaves
        </Text>
      </View>
    </CardContent>
  </Card>
);
