import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { EmployeeT } from '@features/employee/types';
import { getStatusColor } from '@utils/helpers/get-status-color';

type Props = {
  item: EmployeeT;
  onPress: () => void;
};

export const EmployeeListItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${item.user.first_name}` }}
        className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800"
      />

      <View className="ml-4 flex-1">
        <Text variant="heading" className="text-gray-900 dark:text-white">
          {item.user.first_name}
        </Text>
        <Text variant="subtext" className="text-sm">
          {item.user.role} • {item.department}
        </Text>
      </View>

      <View className={cn('rounded-full px-3 py-1', getStatusColor(item.status).bg)}>
        <Text className={cn('text-xs font-semibold', getStatusColor(item.status).text)}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
