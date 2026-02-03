import { View } from 'react-native';
import { Text } from '../ui/text';

export const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-2 flex-row justify-between">
    <Text variant="subtext" className="text-sm font-medium">
      {label}
    </Text>
    <Text className="text-sm font-semibold text-gray-900 dark:text-white">{value}</Text>
  </View>
);
