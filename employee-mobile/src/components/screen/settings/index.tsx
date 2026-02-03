import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore, useTheme } from '@/src/store/theme';
import { Header } from '@/src/components/common/Header';

interface NotificationSetting {
    id: string;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    description: string;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
    {
        id: 'email',
        label: 'Email Notifications',
        icon: 'email-outline',
        description: 'Receive updates via email',
    },
    {
        id: 'push',
        label: 'Push Notifications',
        icon: 'bell-outline',
        description: 'Get alerts on your device',
    },
    {
        id: 'marketing',
        label: 'Marketing Updates',
        icon: 'bullhorn-outline',
        description: 'News about products and features',
    },
    {
        id: 'security',
        label: 'Security Alerts',
        icon: 'shield-check-outline',
        description: 'Important account security notices',
    },
];

const SectionHeader = ({ title }: { title: string }) => (
    <Text className="mb-3 px-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        {title}
    </Text>
);

const SettingItem = ({
    icon,
    label,
    description,
    value,
    onValueChange,
    showBorder = true,
}: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
    showBorder?: boolean;
}) => {
    const theme = useTheme();
    return (
        <View
            className={`flex-row items-center justify-between bg-white px-4 py-4 dark:bg-slate-900 ${showBorder ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}>
            <View className="flex-row items-center gap-4">
                <View className="items-center justify-center rounded-full bg-gray-100 p-2 dark:bg-slate-800">
                    <MaterialCommunityIcons
                        name={icon}
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                    />
                </View>
                <View>
                    <Text className="text-base font-medium text-gray-900 dark:text-white">{label}</Text>
                    {description && (
                        <Text className="text-xs text-gray-500 dark:text-gray-400">{description}</Text>
                    )}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                thumbColor={value ? '#2563EB' : '#F3F4F6'}
            />
        </View>
    );
};

export const SettingsScreen = () => {
    const { theme, toggleTheme } = useThemeStore();
    const currentTheme = useTheme();

    // Mock state for notifications
    const [notificationState, setNotificationState] = useState<Record<string, boolean>>({
        all: true,
        email: true,
        push: true,
        marketing: false,
        security: true,
    });

    const toggleNotification = (key: string) => {
        setNotificationState((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const toggleAllNotifications = (val: boolean) => {
        setNotificationState((prev) => {
            const newState = { ...prev, all: val };
            // If toggling 'all' off, maybe disable everything? 
            // Or just use it as a master switch visually.
            // For this demo, let's just toggle the master switch.
            return newState;
        });
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-950">
            <Header title="Settings" showBackButton={true} />
            <ScrollView className="flex-1">
                <View className="py-6">
                    {/* Appearance Section */}
                    <SectionHeader title="Appearance" />
                    <View className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900">
                        <SettingItem
                            icon={theme === 'dark' ? 'weather-night' : 'weather-sunny'}
                            label="Dark Mode"
                            description="Adjust the appearance of the app"
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            showBorder={false}
                        />
                    </View>

                    {/* Notifications Section */}
                    <SectionHeader title="Notifications" />
                    <View className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900">
                        <SettingItem
                            icon="bell-ring-outline"
                            label="Allow Notifications"
                            value={notificationState.all}
                            onValueChange={toggleAllNotifications}
                            showBorder={true}
                        />

                        {notificationState.all && (
                            <>
                                {NOTIFICATION_SETTINGS.map((setting, index) => (
                                    <SettingItem
                                        key={setting.id}
                                        icon={setting.icon}
                                        label={setting.label}
                                        description={setting.description}
                                        value={notificationState[setting.id]}
                                        onValueChange={() => toggleNotification(setting.id)}
                                        showBorder={index !== NOTIFICATION_SETTINGS.length - 1}
                                    />
                                ))}
                            </>
                        )}
                    </View>

                    <View className="mt-4 items-center">
                        <Text className="text-sm text-gray-400 dark:text-gray-600">v1.0.0 (Build 100)</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingsScreen;
