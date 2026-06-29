import React, { useState } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { Container } from '@components/layout';
import { EmployeeListItem } from '@components/employee-list-item';
import { router } from 'expo-router';
import { LoadingScreen } from '@components/screens/loading-screen';
import { Text } from '@components/ui/text';
import { FilterCard } from '@components/display/filter-card';
import { toast } from '@components/ui';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useEmployees } from '@hooks';
import { SectionHeader } from '@components/base/section-header';
import { SearchInput } from '@components/search-input';
import { FAB } from '@components/fab';

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
        <SectionHeader variant="splash" title="Staff Directory" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <Container className="flex-1">
      <StatusBar barStyle="dark-content" />
      <SectionHeader variant="splash" title="Staff Directory">
        <SearchInput
          placeholder="Search by name or role..."
          value={search}
          onChangeText={setSearch}
          containerClassName="mb-4"
        />
        <FilterCard />
      </SectionHeader>
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
      <FAB icon="add" onPress={() => {}} />
    </Container>
  );
}
