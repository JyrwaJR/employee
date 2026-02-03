import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from '@/src/components/common/Container';
import { Text } from '@/src/components/ui/text';
import { FilterCard } from '@/src/components/common/FilterCard';
import { LeaveCard } from '@/src/components/common/LeaveCard';
import { years } from '@/src/utils/helper/years';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/src/utils/http';
import { LEAVE_ENDPOINTS } from '@/src/libs/endpoints/leave';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { LeaveT } from '@/src/types/leave';
import { LoadingScreen } from '../../common/LoadingScreen';

const statusOptions = [
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const LeaveScreen = () => {
  const [selectedYear, setSelectedYear] = React.useState('2025');
  const { user } = useAuth();
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(true);
  const employeeId = user?.employee_id || '';

  const { data, isFetching } = useQuery({
    queryKey: ['leaves', employeeId, selectedYear, status],
    queryFn: () => http.get<LeaveT[]>(LEAVE_ENDPOINTS.GET_LEAVES.replace(':id', employeeId)),
    enabled: !!employeeId,
    select: (data) => data.data,
  });

  // Filter Logic
  const filteredData = data || [];

  if (isFetching) return <LoadingScreen />;

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
          onStatusChange={(val) => setStatus(status === val ? undefined : val)} // Toggle off if clicked again
          statusOptions={statusOptions}
        />
      </View>

      <FlatList
        data={filteredData}
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
