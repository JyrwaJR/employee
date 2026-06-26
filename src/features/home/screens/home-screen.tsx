import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Container } from '@components/layout/container';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '@stores/theme.store';
import { useAuthStore } from '@stores/auth.store';
import { SectionHeader } from '@components/base/section-header';
import { AnimationProvider, FadeInView } from '@components/fade-in-view';
import { ActiveLeaveCard, QuickActions } from '../components';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { EmptyScreen, LoadingScreen } from '@components/screens';
import { useLeaves } from '@features/leave/hooks';
import { Leave } from '@sharedTypes/leave';
import { cn } from '@utils/helpers/cn';
import { formatDate } from '@utils/formatters/formatters';

function isActiveLeave(leave: Leave): boolean {
  const today = new Date();
  const from = new Date(leave.from_dt1);
  const to = new Date(leave.to_dt1);
  return today >= from && today <= to;
}

// function formatDate(dateStr: string): string {
//   const [y, m, d] = dateStr.split('-');
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
// }

export const HomeScreen = () => {
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const thisYear = new Date().getFullYear();

  const { data, isFetching, refetch } = useLeaves(thisYear.toString(), 'Verified');
  const isAfterNoon = new Date().getUTCHours() >= 12;

  if (isFetching) return <LoadingScreen />;

  if (!data)
    return (
      <>
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
        <EmptyScreen
          title="Something went wrong"
          message="Unable to fetch data"
          refresh={refetch}
          refreshLabel="Reload"
        />
      </>
    );

  const activeLeaves = data.emp_leave_data.filter(isActiveLeave);
  const otherLeaves = data.emp_leave_data.filter((l) => !isActiveLeave(l));

  return (
    <AnimationProvider stagger={80}>
      <Container className="flex-1">
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

        <ScrollView
          className="flex-1 pt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <FadeInView index={0}>
            <View className="my-6">
              <QuickActions />
            </View>
          </FadeInView>

          {activeLeaves.length > 0 && (
            <FadeInView index={1}>
              <View className="mx-6 mb-4">
                <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
                  Active Leaves
                </Text>
                {activeLeaves.map((leave, i) => (
                  <Card key={i} className="mb-3 border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <MaterialCommunityIcons name="umbrella" size={20} color="#22C55E" />
                          </View>
                          <View>
                            <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                              {leave.leave_desc}
                            </Text>
                            <Text variant="subtext" size="sm">
                              {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <View className="rounded-full bg-green-100 px-2.5 py-0.5 dark:bg-green-900/30">
                            <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
                              Active
                            </Text>
                          </View>
                          <Text className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                            {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </FadeInView>
          )}

          <FadeInView index={2}>
            <View className="mx-6 mb-6">
              <Text variant="heading" size="lg" className="mb-4 text-gray-900 dark:text-white">
                Leave History
              </Text>
              {otherLeaves.length === 0 ? (
                <ActiveLeaveCard leave={null} />
              ) : (
                otherLeaves.slice(0, 5).map((leave, i) => {
                  const statusColor =
                    leave.verify_flg_desc === 'Verified'
                      ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                      : leave.verify_flg_desc === 'Rejected'
                        ? 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                        : 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
                  return (
                    <Card key={i} className="mb-3">
                      <CardContent className="p-4">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                                {leave.leave_desc}
                              </Text>
                              <View className={cn('rounded-full px-2 py-0.5', statusColor)}>
                                <Text className="text-xs font-semibold">
                                  {leave.verify_flg_desc}
                                </Text>
                              </View>
                            </View>
                            <Text variant="subtext" size="sm" className="mt-0.5">
                              {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-gray-900 dark:text-white">
                            {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
                          </Text>
                        </View>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </View>
          </FadeInView>
        </ScrollView>
      </Container>
    </AnimationProvider>
  );
};
