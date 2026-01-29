import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function tabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarLabelStyle: {
          color: 'black',
        },
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
