import { cn } from '@/src/libs/cn';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, FlatList } from 'react-native';
import { Container } from '../../common/Container';
import { StatBox } from '../../common/StatsBox';
import { Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { DrawerToggleButton } from '@react-navigation/drawer';

// --- Mock Data ---
const EMPLOYEES = [
  {
    id: '1',
    name: 'Sarah Wilson',
    role: 'UI/UX Designer',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'James Anderson',
    role: 'Product Manager',
    status: 'Meeting',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Frontend Dev',
    status: 'On Leave',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Backend Dev',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: '5',
    name: 'Robert Fox',
    role: 'QA Engineer',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
];

const STATS = [
  { label: 'Total Staff', value: '42', color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Now', value: '38', color: 'bg-green-50 text-green-600' },
  { label: 'On Leave', value: '4', color: 'bg-orange-50 text-orange-600' },
];

const EmployeeCard = ({ item }: { item: (typeof EMPLOYEES)[0] }) => {
  // Status Color Logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'On Leave':
        return 'bg-red-100 text-red-700';
      case 'Meeting':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Avatar */}
      <Image source={{ uri: item.avatar }} className="h-12 w-12 rounded-full bg-gray-200" />

      {/* Info */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.role}</Text>
      </View>

      {/* Status Badge */}
      <View className={cn('rounded-full px-3 py-1', getStatusColor(item.status).split(' ')[0])}>
        <Text className={cn('text-xs font-semibold', getStatusColor(item.status).split(' ')[1])}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Screen ---

export const HomeScreen = () => {
  const [search, setSearch] = useState('');

  return (
    <Container className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      {/* Top Header Section */}
      <View className="z-10 rounded-b-[32px] bg-white px-6 pb-6 pt-4 shadow-sm">
        {/* Nav Bar */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-400">Good Morning,</Text>
            <Text className="text-2xl font-bold text-gray-900">Admin User</Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Text>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Text className="mr-2 text-gray-400">🔍</Text>
          <TextInput
            placeholder="Search employees..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-base text-gray-900"
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
          <Text className="text-lg font-bold text-gray-900">All Employees</Text>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-blue-600">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <FlatList
          data={EMPLOYEES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EmployeeCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for FAB
        />
      </View>

      {/* Floating Action Button (FAB) */}
      <View className="absolute bottom-2 left-6 right-6">
        <TouchableOpacity
          activeOpacity={0.9}
          className="flex-row items-center justify-center rounded-2xl bg-gray-900 py-4 shadow-lg">
          <Text className="mr-2 text-xl font-light text-white">+</Text>
          <Text className="text-base font-bold text-white">Add Employee</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};
