import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Header } from '@/src/components/common/Header';
import { TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/src/store/theme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={24} color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
    </TouchableOpacity>
  );
}
export default function tabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarLabelStyle: {
          color: 'black',
        },
        header: () => <Header
          title="Home"
          leftIcon={<DrawerToggleButton tintColor={'black'} />}
          showBackButton={false}
          rightIcon={<ThemeToggle />}
        />

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor={'black'} />,
          tabBarIcon: () => <MaterialIcons name="home" size={20} color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="statement"
        options={{
          title: 'Statements',
          tabBarLabel: 'Statements',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor={'black'} />,
          tabBarIcon: () => <MaterialIcons name="receipt" size={20} color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor={'black'} />,
          tabBarIcon: () => <MaterialCommunityIcons name="account" size={20} color={'black'} />,
        }}
      />
    </Tabs>
  );
}
