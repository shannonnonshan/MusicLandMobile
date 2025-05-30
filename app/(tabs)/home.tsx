import { fetchTop4Tracks } from '@/axios/deezer.api';
import { getPlaylists as fetchPlaylists } from '@/axios/playlist';
import { useDeviceId } from '@/contexts/DeviceContext';
import { Song, useMusicContext } from '@/contexts/MusicContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Disc, Headphones, Music, Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Platform, StatusBar as RNStatusBar, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInLeft } from 'react-native-reanimated';
const Button = ({ onPress, children, style }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
      },
      style,
    ]}
  >
    {children}
  </TouchableOpacity>
);

const colorsPool = [
  ['#7C3AED', '#3B82F6'],
  ['#22C55E', '#14B8A6'],
  ['#EF4444', '#F97316'],
  ['#F59E0B', '#10B981'],
  ['#6366F1', '#8B5CF6'],
];

interface FeaturedPlaylist {
  playlist:any;
  colors: string[];
}

const HomePage = () => {
  const router = useRouter();
  const { playSong } = useMusicContext();
  const [featuredPlaylists, setFeaturedPlaylists] = useState<FeaturedPlaylist[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const deviceId = useDeviceId();

  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(true);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const data = await fetchPlaylists(deviceId.deviceId);
        const slice = data.slice(0,3)
        const withColors: FeaturedPlaylist[] = slice.map((p: any, i: number) => ({
          playlist: p,
          colors: colorsPool[i % colorsPool.length],
        }));
        setFeaturedPlaylists(withColors);
      } catch (err) {
        console.error('Fetch playlist error:', err);
      } finally {
        setIsPlaylistLoading(false);
      }
    };

    getPlaylists();
  }, [deviceId]);

 const loadRecentSongs = async () => {
  try {
    const recentJSON = await AsyncStorage.getItem('recentSongs');
    let recent: Song[] = recentJSON ? JSON.parse(recentJSON) : [];

    if (recent.length < 4) {
      const res = await fetchTop4Tracks() as { tracks: any[] };
      const fallback: Song[] = res.tracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist?.name || 'Unknown Artist',
        album: track.album?.title || 'Unknown Album',
        duration: track.duration || 0,
        liked: false,
        thumbnail: track.album?.cover || '',
        uri: track.preview || '',
        genre: track.genre || '',
        releaseYear: track.release_year || '',
      }));

      const fallbackFiltered = fallback.filter(
        (song: Song) => !recent.some((r) => r.id === song.id)
      );
      recent = [...recent, ...fallbackFiltered].slice(0, 4);
    } else {
      recent = recent.slice(0, 4);
    }

    setRecentSongs(recent); // đúng biến recent, không phải recentSongs
  } catch (err) {
    console.error('Lỗi khi tải bài hát nghe gần đây:', err);
  } finally {
    setIsRecentLoading(false);
  }
};


  useEffect(() => {
    loadRecentSongs();
  }, []);

  if (isPlaylistLoading || isRecentLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
          <Text style={{ color: 'white' }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 160,
          backgroundColor: '#121212',
        }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Headphones size={24} color="white" />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginLeft: 8 }}>Musicland</Text>
          </View>
        </Animated.View>

        {/* Hero Section */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            backgroundColor: '#F72798',
            overflow: 'hidden',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Your Playlist</Text>
          <Text style={{ fontSize: 14, color: '#E0E0E0', marginBottom: 16 }}>
            Listen to your customised playlists and discover new tracks tailored to your taste.
          </Text>
          <Button
            onPress={() =>
              router.push({
                pathname: '/playlist/list-playlist',
                params: { deviceId: deviceId.deviceId },
              })
            }
            style={{ backgroundColor: 'white' }}
          >
            <Play color="#F57D1F" size={16} />
            <Text style={{ color: '#F57D1F', fontWeight: '600', marginLeft: 8 }}>Go to your playlist</Text>
          </Button>
        </Animated.View>

        {/* Recently Played */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Disc size={20} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginLeft: 8 }}>
            Recommendation
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {recentSongs.length > 0 ? (
            recentSongs.map((song) => (
              <TouchableOpacity
                key={song.id}
                style={{
                  width: '48%',
                  backgroundColor: '#1F2937',
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 12,
                  flexDirection: 'column',
                  alignItems:'center'
                }}
                onPress={() => playSong(song)}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    song.thumbnail?.startsWith('http')
                      ? { uri: song.thumbnail }
                      : require('../../assets/images/MSlogo.png')
                  }
                  style={{
                    width: 150,
                    height: 150,
                    aspectRatio: 1,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <Text style={{ fontWeight: '500', color: 'white' }} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }} numberOfLines={1}>
                  {song.artist}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>No recently played songs</Text>
          )}
        </View>

        {/* Featured Playlists */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 24 }}>
          <Music size={20} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginLeft: 8 }}>
            Featured Playlists
          </Text>
        </View>
        <View>
          {featuredPlaylists.map((playlist, index) => (
            <TouchableOpacity
            key={playlist.playlist._id}
            onPress={() => {
                    router.push({
                      pathname: '/playlist/library',
                      params: { playlistId: playlist.playlist._id},
                    });
                  }}>
            <Animated.View
              entering={SlideInLeft.delay(500 + index * 100)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                backgroundColor: playlist.colors[0],
                minHeight: 70,
                zIndex: featuredPlaylists.length - index,
              }}
            >
              <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{playlist.playlist.name}</Text>
                <Text style={{ color: '#F0F0F0', fontSize: 12 }}>{playlist.playlist.countSong} songs</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: 8,
                  borderRadius: 8,
                }}
                activeOpacity={0.7}
                onPress={() => {
                    router.push({
                      pathname: '/playlist/library',
                      params: { playlistId: playlist.playlist._id},
                    });
                  }}
              >
                <Play color="white" size={16} />
              </TouchableOpacity>
            </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: STATUS_BAR_HEIGHT + 10,
  },
});