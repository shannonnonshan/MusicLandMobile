// components/TabsLayout.tsx
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/IconSymbol';
const tabs = [
  {
    name: 'home',
    icon: ({color} : {color: string}) => <IconSymbol size={28} name="house.fill" color={color} />,
    path: '/(tabs)/home',
    label: 'Home',
  },
  {
    name: 'search',
    icon:  ({color} : {color: string}) => <FontAwesome name="search" size={24} color={color} />,
    path: '/(tabs)/search',
    label: 'Search',
  },
  {
    name: 'player',
    icon:  ({color} : {color: string}) => <FontAwesome5 name="compact-disc" size={24} color={color} />,
    path: '/(tabs)/player',
    label: 'Player',
  },
];

export function TabsLayout({ visible }: { visible: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  if (!visible) return null;

  return (
    <SafeAreaView
     edges={['bottom']}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
       paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {tabs.map((tab) => {
        const isFocused = pathname.includes(tab.name);
        return (
          <Pressable
            key={tab.name}
            onPress={() => router.push({pathname: tab.path as any})}
            style={{ alignItems: 'center' }}
          >
            {typeof tab.icon === 'function'
              ? tab.icon({ color: isFocused ? '#fff' : '#888' })
              : tab.icon}
            <Text style={{ color: isFocused ? '#fff' : '#888', fontWeight: 'bold', fontSize: 12 }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </SafeAreaView>
  );
}