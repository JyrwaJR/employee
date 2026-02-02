import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { EmployeeT } from '@/src/types/employee';
import { cn } from '@/src/libs/cn';
import { Text } from '../../ui/text';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'On Leave':
      return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    case 'Probation':
      return 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
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
      className="mb-3 flex-row items-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${item.user.first_name}` }}
        className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800"
      />

      <View className="ml-4 flex-1">
        <Text variant="heading" className="text-gray-900 dark:text-white">{item.user.first_name}</Text>
        <Text variant="subtext" className="text-sm">
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
