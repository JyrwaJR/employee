import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { Button } from '@components/ui/button';
import { Icon } from '@components/ui/icon';
import { useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { useAuthStore } from '@stores/auth.store';

interface ForbiddenProps {
  title?: string;
  message?: string;
  onPressHome?: () => void;
  onPressTryAgain?: () => void;
}

export const Forbidden = ({
  title = 'Access Denied',
  message = 'You do not have permission to view this page.',
  onPressHome,
  onPressTryAgain,
}: ForbiddenProps) => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handlePress = () => {
    if (onPressHome) {
      onPressHome();
    } else {
      router.replace(PAGE_ROUTES.HOME);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-y-2 p-6">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <Icon name="shield-lock-outline" size={48} color="#EF4444" />
      </View>

      <Text variant="heading" size="3xl" className="mb-2 text-center text-gray-900 dark:text-white">
        {title}
      </Text>

      <Text variant="subtext" className="mb-8 text-center text-base leading-6">
        {message}
      </Text>

      <Button onPress={handlePress} variant={'outline'} activeOpacity={0.8}>
        Go Back Home
      </Button>

      <Button variant={'destructive'} onPress={logout} activeOpacity={0.8}>
        Logout
      </Button>

      {onPressTryAgain && (
        <TouchableOpacity
          onPress={onPressTryAgain}
          activeOpacity={0.7}
          className="mt-4 rounded-full border border-gray-200 px-8 py-3 dark:border-gray-700">
          <Text className="font-medium text-gray-700 dark:text-gray-300">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
