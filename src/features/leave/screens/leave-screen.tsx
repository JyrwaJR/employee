import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from '@components/layout/container';
import { Text } from '@components/ui/text';
import { FilterCard } from '@components/display/filter-card';
import { years } from '@utils/helpers/years';
import { LoadingScreen } from '@components/screens/loading-screen';
import { LeaveCard } from '../components/leave-card';
import { useLeaves } from '../hooks';
import { SectionHeader } from '@components/base/section-header';

const statusOptions = [
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const LeaveScreen = () => {
  const [selectedYear, setSelectedYear] = React.useState('2025');
  const [status, setStatus] = React.useState<string>('APPROVED');
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(true);

  const { data = [], isFetching } = useLeaves(selectedYear, status);

  if (isFetching)
    return (
      <>
        <SectionHeader variant="splash" title="My Leaves" />
        <LoadingScreen />
      </>
    );

  return (
    <Container className="flex-1 bg-gray-50 dark:bg-slate-950">
      <View className="mt-4 px-4">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text variant="subtext" className="mb-1 text-sm font-medium">
              Time Off
            </Text>
            <Text variant="heading" size="2xl" className="text-gray-900 dark:text-white">
              My Leaves
            </Text>
          </View>
          <TouchableOpacity className="b-gray-100 h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <Text className="text-xl">+</Text>
          </TouchableOpacity>
        </View>

        <FilterCard
          isOpen={isFiltersOpen}
          onToggle={setIsFiltersOpen}
          year={selectedYear}
          years={years}
          onYearChange={setSelectedYear}
          status={status}
          onStatusChange={(val) => setStatus(status === val ? '' : val)} // Toggle off if clicked again
          statusOptions={statusOptions}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LeaveCard item={item} onPress={() => {}} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <Text className="mb-4 text-4xl">🏖️</Text>
            <Text variant="subtext" className="text-center font-medium">
              No leaves found for {selectedYear}
            </Text>
          </View>
        }
      />
    </Container>
  );
};
