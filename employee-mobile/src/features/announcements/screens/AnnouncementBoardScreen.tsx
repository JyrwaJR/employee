import React from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { Text } from '@/src/shared/components/ui/text';
import { AnimationProvider, FadeInView } from '@/src/shared/components/ui/FadeInView';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { AnnouncementSkeleton } from '../components/AnnouncementSkeleton';
import { Container } from '@/src/shared/components/layout';
import { Ternary } from '@/src/shared/components/base/Ternary';

/**
 * Announcement Board Screen
 * Orchestrates the paginated list and loading states.
 * Updated to use shared UI primitives.
 */
export const AnnouncementBoardScreen = () => {
  const { data, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useAnnouncements();

  const announcements = data?.pages.flatMap((page) => page.items) ?? [];

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <FadeInView delay={index * 50}>
      <AnnouncementCard item={item} />
    </FadeInView>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <AnnouncementSkeleton />
      </View>
    );
  };

  return (
    <AnimationProvider>
      <Container>
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#3b82f6" />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Ternary
              condition={isLoading}
              ifTrue={
                <View>
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                </View>
              }
              ifFalse={
                <View className="mt-20 items-center justify-center">
                  <Text variant="subtext" size="lg">
                    No announcements yet
                  </Text>
                </View>
              }
            />
          }
          ListFooterComponent={renderFooter}
        />
      </Container>
    </AnimationProvider>
  );
};
