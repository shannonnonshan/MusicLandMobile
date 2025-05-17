import { HapticTab } from '@/components/HapticTab';
import { MiniPlayer } from '@/components/MiniPlayer';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';
import '../../global.css';
export default function TabLayout() {

  return (
    <View style={{ flex: 1 }}>
    <MiniPlayer/>
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({focused }) => (
          <Image
            source={require('../../assets/images/MSlogo.png')}
            style={{
              width: 28,
              height: 28,
              opacity: focused ? 1 : 0.5,
            }}
          />
        ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="playlist-music" size={28} color={color} />),
        }}
      />
    </Tabs>
    </View>
  );
}
