// TabMusicPlayingScreen.js (hoặc .tsx)

import { extractTrackId, fetchLyricsFromDeezer } from '@/axios/deezer.api';
import { MarqueeText } from '@/components/ui/MarqueeText';
import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const loadFonts = () =>
  Font.loadAsync({
    'Lexend-SemiBold': require('@/assets/fonts/lexend_semibold.ttf'),
  });

export const options = {
  headerShown: false,
};

export default function TabMusicPlayingScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const insets = useSafeAreaInsets()
  const { currentSong } = useMusicContext();
  const arlCookie =
    '44f8df9da9be438e3f451a9b6df8c78dda43402d92f2ff263182b1bbed4ef568e76fcc3f171ec99475023939c62792946f5e135f0872bd0a427f1d84f0ea73edb170a51f6701b803aa717b6536f0788bf61b6124abeb97fcfd5fceb87aaaade9';

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    const loadLyrics = async () => {
      if (!currentSong?.id) return;
      const trackId = extractTrackId(currentSong.id);
      if (!trackId) return;

      setLoadingLyrics(true);
      try {
        const res = await fetchLyricsFromDeezer(trackId, arlCookie);
        setLyrics(res);
      } catch (err) {
        setLyrics('Failed to load lyrics.');
      } finally {
        setLoadingLyrics(false);
      }
    };

    loadLyrics();
  }, [currentSong]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { paddingTop: insets.top}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={[styles.lyricsText, { fontFamily: 'Lexend-SemiBold' }]}>
          {loadingLyrics
            ? 'Loading lyrics...'
            : lyrics || 'There are no lyrics available for this song.'}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
            onPress={() => {
              if (router.canGoBack && router.canGoBack()) {
                router.back();
              } else {
                router.push('/(tabs)/home');
              }
            }}
            style={styles.backButton}
          >
            <Entypo name="chevron-small-left" size={20} color="white" />
          </TouchableOpacity>

        <View className='items-center mx-[25%]'>
          <MarqueeText text={currentSong?.title || ''} style={styles.songTitle}/>
          <Text style={styles.songArtist}>{currentSong?.artist}</Text>
        </View>

       <Pressable
            style={styles.addToListButton}
            onPress={() => {
              router.push({
                pathname: '/playlist/list-playlist',
                params: {
                  isPlayer: 'true', // nên là chuỗi nếu dùng trong URL
                },
              });
            }}
          >
          <Entypo name="add-to-list" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const STATUS_BAR_HEIGHT =
  Platform.OS === 'android'
    ? RNStatusBar.currentHeight ?? 24:2
  

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#191A1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#191A1F',
    padding: 16,
    paddingTop: STATUS_BAR_HEIGHT + 20,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 16,
  },
  lyricsText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  footer: {
    height: 66,
    paddingBottom: 8,
    marginBottom: 12,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -12 }],
    maxWidth: '60%',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 8,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  songArtist: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  addToListButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
  },
});
