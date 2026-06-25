import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Container } from '@components/layout/container';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { ScreenHeader } from '@components/layout/screen-header';
import { AnimationProvider, FadeInView } from '@components/fade-in-view';
import { useHomeDashboard } from '../hooks/use-home-dashboard';
import {
  ActiveLeaveCard,
  AnnouncementsPreview,
  LeaveProgressCard,
  QuickActions,
} from '../components';
import { EmptyScreen, LoadingScreen } from '@components/screens';

export const HomeScreen = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { data, isFetching, refetch } = useHomeDashboard();
  const isAfterNoon = new Date().getUTCHours() >= 12;

  if (isFetching) return <LoadingScreen />;

  if (!data)
    return (
      <EmptyScreen
        title="Something went wrong"
        message="Unable to fetch data"
        refresh={refetch}
        refreshLabel="Reload"
      />
    );

  return (
    <AnimationProvider stagger={80}>
      <Container className="flex-1">
        <ScreenHeader
          title={user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...'}
          subtitle={`${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.department ?? ''}`}
          rightElement={
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color={theme === 'dark' ? 'white' : 'black'}
              />
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <FadeInView index={0}>
            <LeaveProgressCard
              annual={data?.leaveBalance?.annual}
              sick={data?.leaveBalance?.sick}
              present={data.attendance.present}
              workingDays={data.attendance.workingDays}
            />
          </FadeInView>

          <FadeInView index={1}>
            <View className="my-6">
              <QuickActions />
            </View>
          </FadeInView>

          <FadeInView index={2}>
            <View className="mb-6">
              <ActiveLeaveCard leave={data?.activeLeave} />
            </View>
          </FadeInView>

          <FadeInView index={3}>
            <AnnouncementsPreview announcements={data?.announcements} />
          </FadeInView>
        </ScrollView>
      </Container>
    </AnimationProvider>
  );
};
