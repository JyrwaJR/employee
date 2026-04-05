import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Container } from '@/src/shared/components/layout/Container';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/src/shared/utils/http';
import { EMPLOYEE_ENDPOINTS } from '@/src/features/employee/services/employee.service';
import { EmployeeT } from '@/src/features/employee/types';
import { EmployeeListItem } from '../components/EmployeeListItem';
import { router } from 'expo-router';
import { LoadingScreen } from '@/src/shared/components/screens/LoadingScreen';
import { Text } from '@/src/shared/components/ui/text';
import { FilterCard } from '@/src/shared/components/display/FilterCard';
import { queryKeys } from '@/src/shared/api/query-keys';
import { routes } from '@/src/shared/constants/routes';

// --- Screen ---
export default function EmployeeListScreen() {
  const [search, setSearch] = useState('');

  const { data: EMPLOYEES, isFetching } = useQuery({
    queryKey: queryKeys.employees.list,
    queryFn: () => http.get<EmployeeT[]>(EMPLOYEE_ENDPOINTS.GET_EMPLOYEES),
    select: (data) => data.data || [],
  });

  const filteredData = EMPLOYEES;

  if (isFetching) return <LoadingScreen />;

  return (
    <Container className="flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="z-10 rounded-b-[32px] border-b border-gray-100 bg-white px-6 pb-4 pt-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Text variant="heading" size="2xl" className="mb-4 text-gray-900 dark:text-white">
          Staff Directory
        </Text>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
          <Text className="mr-2 text-gray-400">🔍</Text>
          <TextInput
            placeholder="Search by name or role..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-base text-gray-900 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filters */}
        <FilterCard />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EmployeeListItem
            item={item}
            onPress={() => router.push(routes.employees.details(item.id))}
          />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <Text className="text-lg text-gray-400">No employees found</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30">
        <Text className="text-2xl font-light text-white">+</Text>
      </TouchableOpacity>
    </Container>
  );
}
