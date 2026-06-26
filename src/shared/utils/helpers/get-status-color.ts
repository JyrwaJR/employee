import { MaterialCommunityIcons } from '@expo/vector-icons';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Verified':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        icon: '#166534',
        iconName: 'check-circle' as keyof typeof MaterialCommunityIcons.glyphMap,
      };
    case 'Pending':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-800 dark:text-orange-400',
        icon: '#C2410C',
        iconName: 'clock-outline' as keyof typeof MaterialCommunityIcons.glyphMap,
      };
    case 'Rejected':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        icon: '#991B1B',
        iconName: 'close-circle' as keyof typeof MaterialCommunityIcons.glyphMap,
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-400',
        icon: '#4B5563',
        iconName: 'help-circle' as keyof typeof MaterialCommunityIcons.glyphMap,
      };
  }
};
