import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export default function tabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          color: 'black',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: () => <MaterialIcons name="home" size={20} color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="statement"
        options={{
          title: 'Statements',
          tabBarLabel: 'Statements',
          headerShown: false,
          tabBarIcon: () => <MaterialIcons name="receipt" size={20} color={'black'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: () => <MaterialCommunityIcons name="account" size={20} color={'black'} />,
        }}
      />
    </Tabs>
  );
}
