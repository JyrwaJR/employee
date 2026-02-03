import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/store/theme';
import { useRouter } from 'expo-router';

interface UnderDevelopmentProps {
    title?: string;
    message?: string;
    showBackButton?: boolean;
}

export const UnderDevelopment = ({
    title = 'Under Development',
    message = "We're currently working hard on this feature. Stay tuned!",
    showBackButton = true,
}: UnderDevelopmentProps) => {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-slate-950">
            <View className="mb-6 items-center justify-center rounded-full bg-blue-50 p-6 dark:bg-blue-900/20">
                <MaterialCommunityIcons
                    name="hammer-wrench"
                    size={48}
                    color={theme === 'dark' ? '#60A5FA' : '#2563EB'}
                />
            </View>

            <Text className="mb-3 text-center text-xl font-bold text-slate-900 dark:text-white">
                {title}
            </Text>

            <Text className="mb-8 text-center text-base leading-6 text-slate-600 dark:text-slate-400">
                {message}
            </Text>

            {showBackButton && (
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="rounded-xl bg-blue-600 px-6 py-3 active:bg-blue-700">
                    <Text className="font-medium text-white">Go Back</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
