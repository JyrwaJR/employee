import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from '@shared/components/layout/container';
import { StatBox } from '@shared/components/display/stats-box';
import { useAuth } from '@shared/hooks/use-auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingScreen } from '@shared/components/screens/loading-screen';
import { router } from 'expo-router';
import { Text } from '@shared/components/ui/text';
import { useThemeStore } from '@shared/stores/theme.store';
import { ROUTES } from '@constants/routes';
import { STATS } from '../utils';
import { useEmployees } from '@/src/shared/hooks';
import { EmployeeListItem } from '@/src/shared/components/employee-list-item';
import { ScreenHeader } from '@/src/shared/components/layout/screen-header';
import { SearchInput } from '@/src/shared/components/search-input';

export const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { theme } = useThemeStore();

  const { data: EMPLOYEES, isFetching } = useEmployees();

  if (isFetching) return <LoadingScreen />;

  const BellIcon = (
    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
      <MaterialCommunityIcons name="bell" size={24} color={theme === 'dark' ? 'white' : 'black'} />
    </TouchableOpacity>
  );

  return (
    <Container className="flex-1">
      <ScreenHeader
        title={user ? user?.first_name + ' ' + user?.last_name : 'Loading...'}
        subtitle="Good Morning,"
        rightElement={BellIcon}>
        <SearchInput placeholder="Search employees..." value={search} onChangeText={setSearch} />
      </ScreenHeader>
      {/* Content Scroll */}
      ...
      <View className="flex-1 px-6 pt-6">
        {/* Stats Row */}
        <View className="mb-8 flex-row gap-x-2">
          {STATS.map((stat, index) => (
            <StatBox key={index} label={stat.label} value={stat.value} color={stat.color} />
          ))}
        </View>

        {/* List Header */}
        <View className="mb-4 flex-row items-end justify-between">
          <Text variant="heading" size="lg" className="text-gray-900 dark:text-white">
            All Employees
          </Text>
          <TouchableOpacity>
            <Text variant="link" className="text-sm font-semibold">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <FlatList
          data={EMPLOYEES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeListItem
              onPress={() => router.push(ROUTES.employees.details(item.id))}
              item={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for FAB
        />
      </View>
    </Container>
  );
};
