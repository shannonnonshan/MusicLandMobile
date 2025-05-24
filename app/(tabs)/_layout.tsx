import { HapticTab } from '@/components/HapticTab';
import { MiniPlayer } from '@/components/MiniPlayer';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs, useSegments } from 'expo-router';
import { View } from 'react-native';
import '../../global.css';

export default function TabLayout() {
  const segments = useSegments(); // Lấy segment từ URL, ví dụ: ['(tabs)', 'home']
  
  // Kiểm tra nếu là home hoặc search thì mới hiện MiniPlayer
  const currentTab = segments[1]; // segments[0] là "(tabs)", segments[1] là tên trang
  const showMiniPlayer = currentTab === 'home' || currentTab === 'search';

  return (
    <View style={{ flex: 1 }}>
      {showMiniPlayer && <MiniPlayer />}

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
              <IconSymbol size={28} name="library.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="player"
          options={{
            title: 'Player',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
