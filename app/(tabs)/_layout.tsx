import { TabsLayout } from '@/components/TabsLayout';
import { Slot, useSegments } from 'expo-router';
import '../../global.css';
export default function TabLayout() {
  const segments = useSegments();
  const inTab = segments[0] === '(tabs)';
  return (
    <>
    <Slot />
      <TabsLayout visible={inTab} />
    </>
  );
}
