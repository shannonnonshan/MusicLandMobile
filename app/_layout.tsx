import { MiniPlayer } from '@/components/MiniPlayer';
import { DeviceIdProvider } from '@/contexts/DeviceContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const pathname = usePathname();

  const hideMiniPlayer = pathname === '/player' || pathname === '/music/detail-music';

  if (!loaded) return null;

  return (
    <DeviceIdProvider>
      <MusicProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="music/detail-music" options={{ headerShown: false }} />
            <Stack.Screen name="playlist/list-playlist" options={{ headerShown: false }} />
            <Stack.Screen name="playlist/(modal)/create" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>

          {!hideMiniPlayer && <MiniPlayer/>}
          <StatusBar style="auto" />
        </View>
      </MusicProvider>
    </DeviceIdProvider>
  );
}
