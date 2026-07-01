import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import {
  HomeActiveLeaveCard,
  HomeHeader,
  HomeLeaveEmptyCard,
  HomeLeavePreview,
  HomeQuickActions,
} from '../components';
import { Text } from '@components/ui/text';
import { EmptyScreen } from '@components/screens';
import { useLeaves } from '@hooks';
import { HomeScreenSkeleton } from '@features/skeleton/components';
import { isActiveLeave } from '../utils';

export const HomeScreen = () => {
  const { user, isAuthLoading, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const { data, isFetching, isLoading, refetch } = useLeaves();
  const isAfterNoon = new Date().getUTCHours() >= 12;
  const userName = user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...';
  const greeting = `${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.emp_dept ?? ''}`;

  if (isLoading || isAuthLoading) return <HomeScreenSkeleton />;

  if (!data) {
    return (
      <Container className="flex-1">
        <HomeHeader subtitle={greeting} userName={userName} theme={theme} onLogout={logout} />
        <EmptyScreen
          title="Something went wrong"
          message="Unable to fetch data"
          refresh={refetch}
          refreshLabel="Reload"
        />
      </Container>
    );
  }

  const activeLeaves = data.filter((l) => isActiveLeave(l));
  const otherLeaves = data.filter((l) => !isActiveLeave(l));

  return (
    <Container className="flex-1">
      <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        <HomeHeader subtitle={greeting} userName={userName} theme={theme} onLogout={logout} />

        <View className="my-6">
          <HomeQuickActions />
        </View>

        {activeLeaves?.length > 0 && (
          <View className="mb-4">
            <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
              Active Leaves
            </Text>
            {activeLeaves.map((item) => (
              <HomeActiveLeaveCard key={item.id} leave={item} />
            ))}
          </View>
        )}

        <View className="mb-6">
          <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
            Leave History
          </Text>
          {otherLeaves.length === 0 ? (
            <HomeLeaveEmptyCard />
          ) : (
            otherLeaves.map((item) => <HomeLeavePreview key={item.id} leave={item} />)
          )}
        </View>
      </ScrollView>
    </Container>
  );
};
