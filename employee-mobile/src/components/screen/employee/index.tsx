import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Container } from '../../common/Container';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const EMPLOYEES = [
  {
    id: '1',
    name: 'Amit Sharma',
    role: 'Senior Tech Officer',
    dept: 'IT',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'Priya Verma',
    role: 'Assistant Officer',
    dept: 'Admin',
    status: 'On Leave',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'Rahul Singh',
    role: 'Scientist C',
    dept: 'Research',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    role: 'Jr. Secretariat Asst',
    dept: 'Accounts',
    status: 'Probation',
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: '5',
    name: 'Vikram Malhotra',
    role: 'Director',
    dept: 'Management',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: '6',
    name: 'Arjun Nair',
    role: 'Tech Assistant',
    dept: 'Lab',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=6',
  },
];

// --- Components ---

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mr-2 rounded-full border px-4 py-2',
      active ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white'
    )}>
    <Text className={cn('text-sm font-medium', active ? 'text-white' : 'text-gray-600')}>
      {label}
    </Text>
  </TouchableOpacity>
);

const EmployeeListItem = ({
  item,
  onPress,
}: {
  item: (typeof EMPLOYEES)[0];
  onPress: () => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700';
      case 'On Leave':
        return 'bg-orange-50 text-orange-700';
      case 'Probation':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <Image source={{ uri: item.avatar }} className="h-12 w-12 rounded-full bg-gray-100" />

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          {item.role} • {item.dept}
        </Text>
      </View>

      <View className={cn('rounded-full px-3 py-1', getStatusColor(item.status).split(' ')[0])}>
        <Text className={cn('text-xs font-semibold', getStatusColor(item.status).split(' ')[1])}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Screen ---
export default function EmployeeListScreen({ navigation }: { navigation?: any }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredData = EMPLOYEES.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || emp.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="z-10 rounded-b-[32px] bg-white px-6 pb-4 pt-4 shadow-sm">
        <Text className="mb-4 text-2xl font-bold text-gray-900">Staff Directory</Text>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Text className="mr-2 text-gray-400">🔍</Text>
          <TextInput
            placeholder="Search by name or role..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filters */}
        <View className="flex-row">
          {['All', 'Active', 'On Leave', 'Probation'].map((f) => (
            <FilterChip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>
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
            onPress={() => navigation?.navigate('EmployeeDetail', { id: item.id })}
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
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg">
        <Text className="text-2xl font-light text-white">+</Text>
      </TouchableOpacity>
    </Container>
  );
}
