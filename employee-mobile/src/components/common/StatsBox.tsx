import { cn } from '@/src/libs/cn';
import { View, Text } from 'react-native';

export const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View className="mx-1.5 flex-1 items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <Text className={cn('mb-1 text-xl font-bold', color)}>{value}</Text>
    <Text className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</Text>
  </View>
);
