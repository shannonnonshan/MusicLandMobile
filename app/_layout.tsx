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

  const segments = useSegments();
  const currentTab = segments[1]; // ví dụ: ['(tabs)', 'home']

  const showMiniPlayer = currentTab === 'home' || currentTab === 'search';

  if (!loaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <MusicProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            {/* Main tabs layout */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Not Found screen */}
            <Stack.Screen name="+not-found" />

            {/* Detail music screen */}
            <Stack.Screen
              name="music/detail-music"
              options={{ headerShown: false }}
            />

            {/* Playlist listing */}
            <Stack.Screen
              name="playlist/list-playlist"
              options={{ headerShown: false }}
            />

            {/* Modal popup (create playlist) */}
            <Stack.Screen
              name="playlist/(modal)/create"
              options={{ presentation: 'modal', headerShown: false }}
            />
          </Stack>

          {showMiniPlayer && <MiniPlayer />}

          <StatusBar style="auto" />
        </View>
      </MusicProvider>
    </ThemeProvider>
  );
}
