import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Container } from '@/src/components/common/Container';
import { Text } from '@/src/components/ui/text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ForbiddenProps {
    title?: string;
    message?: string;
    onPressHome?: () => void;
}

export const Forbidden = ({
    title = 'Access Denied',
    message = 'You do not have permission to view this page.',
    onPressHome,
}: ForbiddenProps) => {
    const router = useRouter();

    const handlePress = () => {
        if (onPressHome) {
            onPressHome();
        } else {
            router.replace('/');
        }
    };

    return (
        <View className="flex-1 items-center justify-center p-6">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <MaterialCommunityIcons name="shield-lock-outline" size={48} color="#EF4444" />
            </View>

            <Text variant="heading" size="3xl" className="mb-2 text-center text-gray-900 dark:text-white">
                {title}
            </Text>

            <Text variant="subtext" className="mb-8 text-center text-base leading-6">
                {message}
            </Text>

            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                className="rounded-full bg-gray-900 px-8 py-3 dark:bg-white">
                <Text className="font-semibold text-white dark:text-gray-900">Go Back Home</Text>
            </TouchableOpacity>
        </View>
    );
};
