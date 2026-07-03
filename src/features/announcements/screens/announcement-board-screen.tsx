import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useAnnouncements } from '../hooks/use-announcements';
import { AnnouncementCard } from '../components/announcement-card';
import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { AnnouncementBoardSkeleton } from '@features/skeleton';

/**
 * Announcement Board Screen
 * Orchestrates the paginated list and loading states.
 * Updated to use shared UI primitives.
 */
export const AnnouncementBoardScreen = () => {
  const { data: announcements, isLoading, isFetching, refetch } = useAnnouncements();

  if (isLoading) return <AnnouncementBoardSkeleton />;

  if (!announcements || announcements.length === 0) {
    return <EmptyScreen title="No announcements yet" />;
  }

  return (
    <Container>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AnnouncementCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#3b82f6" />
        }
        onEndReachedThreshold={0.5}
      />
    </Container>
  );
};
