import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { AnnouncementT } from '../types';

/**
 * Announcement Card Component
 */
export const AnnouncementCard = ({ item }: { item: AnnouncementT }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="mb-4 rounded-lg border border-gray-100  p-5 dark:border-gray-800">
      <View className="mb-3 flex-row items-center justify-between">
        {!item.isRead && <View className="h-2 w-2 rounded-full bg-blue-500" />}
      </View>

      <Text variant="heading" size="sm" className="mb-1 text-gray-900 dark:text-white">
        {item.title}
      </Text>
      <Text numberOfLines={2} variant="subtext" className="mb-3 text-sm leading-5">
        {item.description}
      </Text>

      <View className="flex-row items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-800">
        <Text className="text-[10px] font-medium text-gray-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.priority === 'HIGH' && (
          <View className="flex-row items-center">
            <Text className="mr-1 text-xs">⚠️</Text>
            <Text className="text-xs font-bold text-red-500">Urgent</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
