
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle={'dark-content'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#ffffffff',
          tabBarStyle: {
            backgroundColor: '#000',
            paddingTop: 5,
            height: 60,
            borderTopWidth: 1,
            borderTopColor: '#1F1F1F',
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 9,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name={focused?"home":"home"} size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600', 
                }}
              >
                Home
              </Text>
            ),
          }}
        />

        <Tabs.Screen
          name="offers"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons  name={focused?"calendar-sharp":"calendar-outline"} size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600',
                }}
              >
                Attendance
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused?"card":"card-outline"} size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600',
                }}
              >
                Revenue
              </Text>
            ),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600',
                }}
              >
                Profile
              </Text>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
