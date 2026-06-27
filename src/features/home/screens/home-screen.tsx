import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { AnimationProvider, FadeInView } from '@components/fade-in-view';
import {
  HomeActiveLeaveCard,
  HomeHeader,
  HomeLeaveEmptyCard,
  HomeLeavePreview,
  HomeQuickActions,
} from '../components';
import { Text } from '@components/ui/text';
import { EmptyScreen, LoadingScreen } from '@components/screens';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';

export const HomeScreen = () => {
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const { data, isFetching, isLoading, refetch } = useLeaves();
  const isAfterNoon = new Date().getUTCHours() >= 12;
  const userName = user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...';
  const greeting = `${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.emp_dept ?? ''}`;

  if (isLoading) return <LoadingScreen />;

  if (!data) {
    return (
      <AnimationProvider stagger={80}>
        <Container className="flex-1">
          <HomeHeader subtitle={greeting} userName={userName} theme={theme} onLogout={logout} />
          <EmptyScreen
            title="Something went wrong"
            message="Unable to fetch data"
            refresh={refetch}
            refreshLabel="Reload"
          />
        </Container>
      </AnimationProvider>
    );
  }

  const activeLeaves = data.filter((l) => isActiveLeave(l));
  const otherLeaves = data.filter((l) => !isActiveLeave(l));

  return (
    <AnimationProvider stagger={80}>
      <Container className="flex-1">
        <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
          <HomeHeader subtitle={greeting} userName={userName} theme={theme} onLogout={logout} />

          <FadeInView index={0}>
            <View className="my-6">
              <HomeQuickActions />
            </View>
          </FadeInView>

          {activeLeaves?.length > 0 && (
            <FadeInView index={1}>
              <View className="mb-4">
                <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
                  Active Leaves
                </Text>
                {activeLeaves.map((item) => (
                  <HomeActiveLeaveCard key={item.id} leave={item} />
                ))}
              </View>
            </FadeInView>
          )}

          <FadeInView index={2}>
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
          </FadeInView>
        </ScrollView>
      </Container>
    </AnimationProvider>
  );
};
