import { MusicProvider } from '@//contexts/MusicContext'; // <== IMPORT NÀY QUAN TRỌNG
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <MusicProvider> 
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="music/detail-music" options={{ headerShown: false }} />
          <Stack.Screen name="playlist/list-playlist" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </MusicProvider>
    </ThemeProvider>
  );
}
