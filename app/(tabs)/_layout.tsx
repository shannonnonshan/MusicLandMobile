import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import '../../global.css';
export default function TabLayout() {

  return (
    <View style={{ flex: 1 }}>
      

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
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="search" size={24} color={ color } />
            ),
          }}
        />
        <Tabs.Screen
          name="player"
          options={{
            title: 'Player',
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
      </Tabs>
    </View>
  );
}
