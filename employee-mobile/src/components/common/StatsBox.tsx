import { cn } from '@/src/libs/cn';
import { View } from 'react-native';
import { Text } from '../ui/text';

export const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View className="mx-1.5 flex-1 items-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
    <Text className={cn('mb-1 text-xl font-bold', color)}>{value}</Text>
    <Text variant="subtext" className="text-xs font-medium uppercase tracking-wider">{label}</Text>
  </View>
);
