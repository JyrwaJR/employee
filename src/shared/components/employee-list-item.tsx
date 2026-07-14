import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { Text } from '@components/ui/text';
import { getStatusColor } from '@utils/helpers/get-status-color';
import { UserT } from '@sharedTypes/auth';

type Props = {
  item: UserT;
  onPress: () => void;
};

export const EmployeeListItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-4 flex-row items-center rounded-2xl border border-border bg-card p-4 shadow-sm">
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${item.emp_cd}` }}
        className="h-12 w-12 rounded-full bg-muted"
      />

      <View className="ml-4 flex-1">
        <Text variant="heading" className="text-foreground">
          {item.emp_fname}
        </Text>
        <Text variant="subtext" className="text-sm">
          {item.emp_designation} • {item.emp_dept}
        </Text>
      </View>

      <View className={cn('rounded-full px-3 py-1', getStatusColor(item.emp_status).bg)}>
        <Text className={cn('text-xs font-semibold', getStatusColor(item.emp_status).text)}>
          {item.emp_status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
