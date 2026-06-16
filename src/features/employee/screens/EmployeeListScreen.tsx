import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Container } from '@/src/shared/components/layout/Container';
import { EmployeeListItem } from '../components/EmployeeListItem';
import { router } from 'expo-router';
import { LoadingScreen } from '@/src/shared/components/screens/LoadingScreen';
import { Text } from '@/src/shared/components/ui/text';
import { FilterCard } from '@/src/shared/components/display/FilterCard';
import { notify } from '@/src/shared/utils/notify';
import { routes } from '@/src/shared/constants/routes';
import { useEmployees } from '../hooks';
import { ScreenHeader } from '@/src/shared/components/layout/ScreenHeader';
import { SearchInput } from '@/src/shared/components/ui/SearchInput';

// --- Screen ---
export default function EmployeeListScreen() {
  const [search, setSearch] = useState('');
  const [page, _] = useState<number>(1);

  const { data: EMPLOYEES, isFetching, isError, error } = useEmployees({ page });

  // Handle Query Error
  React.useEffect(() => {
    let isMounted = true;
    if (isError && isMounted) {
      notify(error, 'EMPLOYEE_UPDATE');
    }
    return () => {
      isMounted = false;
    };
  }, [isError, error]);

  const filteredData = EMPLOYEES;

  if (isFetching) return <LoadingScreen />;

  return (
    <Container className="flex-1">
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Staff Directory">
        <SearchInput
          placeholder="Search by name or role..."
          value={search}
          onChangeText={setSearch}
          containerClassName="mb-4"
        />
        <FilterCard />
      </ScreenHeader>
      {/* List */}
      ...
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
