import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Home, Wine, BarChart, Users, Bot } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.accent,
        tabBarInactiveTintColor: Colors.dark.subtext,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <Wine size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wine-network"
        options={{
          title: 'WNetwork',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wine-bot"
        options={{
          title: 'Wine Bot',
          tabBarIcon: ({ color }) => <Bot size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.dark.background,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
  },
});