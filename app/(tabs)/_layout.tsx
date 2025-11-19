
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
          tabBarActiveTintColor: '#FF6B6B',
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
              <MaterialCommunityIcons  name={focused?"gift":"gift-outline"} size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600',
                }}
              >
                Offers
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused?"person":"person-outline"} size={20} color={color} />
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

        <Tabs.Screen
          name="cart"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused?"bag":"bag-outline"} size={20} color={color} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: focused ? '800' : '600',
                }}
              >
                Cart
              </Text>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
