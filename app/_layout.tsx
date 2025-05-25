import { MiniPlayer } from '@/components/MiniPlayer';
import { MusicProvider } from '@/contexts/MusicContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const segments = useSegments(); // <-- Quan trọng để biết route hiện tại
  const currentTab = segments[1]; // segments[0] là layout như (tabs), segments[1] là tên cụ thể
  const showMiniPlayer = currentTab === 'home' || currentTab === 'search';

  if (!loaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <MusicProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="music/detail-music" options={{ headerShown: false }} />
            <Stack.Screen name="playlist/list-playlist" options={{ headerShown: false }} />
          </Stack>

          {showMiniPlayer && <MiniPlayer />}

          <StatusBar style="auto" />
        </View>
      </MusicProvider>
    </ThemeProvider>
  );
}
