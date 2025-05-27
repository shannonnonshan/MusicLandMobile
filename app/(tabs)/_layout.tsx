import { TabsLayout } from '@/components/TabsLayout';
import { Slot, useSegments } from 'expo-router';
import { View } from 'react-native';
import '../../global.css';
export default function TabLayout() {
  const segments = useSegments();
  const inTab = segments[0] === '(tabs)';
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <TabsLayout visible={inTab} />
    </View>
  );
}
