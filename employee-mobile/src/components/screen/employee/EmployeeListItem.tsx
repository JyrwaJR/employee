import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { EmployeeT } from '@/src/types/employee';
import { cn } from '@/src/libs/cn';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-50 text-green-700';
    case 'On Leave':
      return 'bg-orange-50 text-orange-700';
    case 'Probation':
      return 'bg-purple-50 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

type Props = {
  item: EmployeeT;
  onPress: () => void;
};

export const EmployeeListItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${item.user.first_name}` }}
        className="h-12 w-12 rounded-full bg-gray-100"
      />

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-gray-900">{item.user.first_name}</Text>
        <Text className="text-sm text-gray-500">
          {item.user.role} • {item.department}
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
