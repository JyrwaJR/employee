import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Container } from '@components/layout';
import { EmployeeListItem } from '@components/employee-list-item';
import { router } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { Text } from '@components/ui/text';
import { FilterCard } from '@components/display/filter-card';
import { toast } from '@components/ui';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useEmployees } from '@shared/hooks';
import { ScreenHeader } from '@components/layout/screen-header';
import { SearchInput } from '@components/search-input';

// --- Screen ---
export default function EmployeeListScreen() {
  const [search, setSearch] = useState('');
  const [page, _] = useState<number>(1);

  const { data: EMPLOYEES, isFetching, isError, error } = useEmployees({ page });

  // Handle Query Error
  React.useEffect(() => {
    let isMounted = true;
    if (isError && isMounted) {
      toast.error('Update Failed', {
        description: (error as any)?.message || 'Could not update employee details',
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isError, error]);

  const filteredData = EMPLOYEES;

  if (isFetching) {
    return (
      <>
        <ScreenHeader title="Staff Directory" />
        <LoadingScreen />
      </>
    );
  }

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
            onPress={() => router.push(PAGE_ROUTES.EMPLOYEES.DETAILS(item.id))}
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
