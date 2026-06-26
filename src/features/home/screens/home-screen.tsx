import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Container } from '@components/layout/container';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { SectionHeader } from '@components/base/section-header';
import { AnimationProvider, FadeInView } from '@components/fade-in-view';
import { HomeActiveLeaveCard, HomeLeavePreview, HomeQuickActions } from '../components';
import { Text } from '@components/ui/text';
import { EmptyScreen, LoadingScreen } from '@components/screens';
import { useLeaves } from '@hooks';
import { Leave } from '@sharedTypes/leave';

function isActiveLeave(leave: Leave): boolean {
  const today = new Date();
  const from = new Date(leave.from_dt1);
  const to = new Date(leave.to_dt1);
  return today >= from && today <= to;
}

export const HomeScreen = () => {
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const { data, isFetching, isLoading, refetch } = useLeaves();
  const isAfterNoon = new Date().getUTCHours() >= 12;

  if (isLoading) return <LoadingScreen />;

  if (!data)
    return (
      <>
        <SectionHeader
          variant="splash"
          title={user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...'}
          subtitle={`${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.department ?? ''}`}
          rightElement={
            <View className="flex-1 flex-row gap-2">
              <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <MaterialCommunityIcons
                  name="bell"
                  size={24}
                  color={theme === 'dark' ? 'white' : 'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={logout}
                className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={theme === 'dark' ? 'white' : 'black'}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <EmptyScreen
          title="Something went wrong"
          message="Unable to fetch data"
          refresh={refetch}
          refreshLabel="Reload"
        />
      </>
    );

  const activeLeaves = data.filter((l) => isActiveLeave(l));
  const otherLeaves = data.filter((l) => !isActiveLeave(l));

  return (
    <AnimationProvider stagger={80}>
      <Container className="flex-1">
        <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
          <SectionHeader
            variant="splash"
            title={user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...'}
            subtitle={`${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.department ?? ''}`}
            rightElement={
              <>
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <MaterialCommunityIcons
                    name="bell"
                    size={24}
                    color={theme === 'dark' ? 'white' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={logout}
                  className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color={theme === 'dark' ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </>
            }
          />

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
                <HomeActiveLeaveCard leave={null} />
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
