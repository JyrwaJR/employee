import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Container } from '@/src/shared/components/layout/Container';
import { StatBox } from '@/src/shared/components/display/StatsBox';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LoadingScreen } from '@/src/shared/components/screens/LoadingScreen';
import { http } from '@/src/shared/utils/http';
import { EMPLOYEE_ENDPOINTS } from '@/src/features/employee/services/employee.service';
import { router } from 'expo-router';
import { Text } from '@/src/shared/components/ui/text';
import { useThemeStore } from '@/src/shared/store/theme.store';
import { EmployeeT } from '../../employee/types';
import { EmployeeListItem } from '../../employee/components/EmployeeListItem';

const STATS = [
  { label: 'Total Staff', value: '42', color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Active Now', value: '38', color: 'text-green-600 dark:text-green-400' },
  { label: 'On Leave', value: '4', color: 'text-orange-600 dark:text-orange-400' },
];

export const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { theme } = useThemeStore();

  const { data: EMPLOYEES, isFetching } = useQuery({
    queryKey: ['employees'],
    queryFn: () => http.get<EmployeeT[]>(EMPLOYEE_ENDPOINTS.GET_EMPLOYEES),
    select: (data) => data.data || [],
    enabled: !!user,
  });

  if (isFetching) return <LoadingScreen />;

  return (
    <Container className="flex-1">
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {/* Top Header Section */}
      <View className="z-10 rounded-b-[32px] border-b border-gray-100 bg-white px-6 pb-6 pt-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Nav Bar */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text variant="subtext" className="text-sm font-medium">
              Good Morning,
            </Text>
            <Text variant="heading" size="2xl" className="text-gray-900 dark:text-white">
              {user?.first_name + ' ' + user?.last_name}
            </Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={theme === 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
          <Text className="mr-2 text-gray-400">🔍</Text>
          <TextInput
            placeholder="Search employees..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-base text-gray-900 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Content Scroll */}
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
            <EmployeeListItem onPress={() => router.push(`/employees/${item.id}`)} item={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for FAB
        />
      </View>
    </Container>
  );
};
