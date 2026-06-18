import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../ui/button';
import { PAGE_ROUTES } from '@utils/constants/routes';

export const NotFoundScreen = ({
  title = '404 - Page Not Found',
  message = 'The page you are trying to access does not exist. Please try again.',
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-4 bg-white p-6">
      <Text className="text-4xl font-bold text-red-500">404</Text>

      <Text className="text-2xl font-bold text-red-500">{title}</Text>

      <Text className="text-center text-gray-500">{message}</Text>

      <View className="mt-4 w-full items-center justify-center gap-3">
        <Button className="w-full" title="Go Back" onPress={() => router.back()} />
        <Button title="Go Home" className="w-full" onPress={() => router.push(PAGE_ROUTES.HOME)} />
      </View>
    </View>
  );
};
