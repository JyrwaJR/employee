import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { AnnouncementT } from '../types/dashboard';

/** Props for {@link AnnouncementsPreview}. */
interface AnnouncementsPreviewProps {
  /** List of announcements to display. */
  announcements: AnnouncementT[];
}

/**
 * Displays a preview list of recent announcements with a "View All" link.
 * Each item shows title, date, and a short preview snippet.
 */
export const AnnouncementsPreview = ({ announcements }: AnnouncementsPreviewProps) => (
  <View className="mx-6">
    <View className="mb-4 flex-row items-center justify-between">
      <Text variant="heading" size="lg" className="text-gray-900 dark:text-white">
        Announcements
      </Text>
      <TouchableOpacity onPress={() => router.push(PAGE_ROUTES.ANNOUNCEMENT)}>
        <Text variant="link" className="text-sm font-semibold">
          View All
        </Text>
      </TouchableOpacity>
    </View>
    {announcements.map((item) => (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <View className="mb-1 flex-row items-center justify-between">
          <Text
            className="flex-1 text-sm font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}>
            {item.title}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#9CA3AF" />
        </View>
        <Text variant="subtext" size="xs" className="mb-1">
          {item.date}
        </Text>
        <Text variant="subtext" size="sm" numberOfLines={2}>
          {item.preview}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);
