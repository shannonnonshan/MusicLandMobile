import { fetchPlaylists } from '@/axios/platform.api';
import { useMusicContext } from '@/contexts/MusicContext';
import { useRouter } from 'expo-router';
import { Disc, Headphones, Music, Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInLeft } from 'react-native-reanimated';
// Tạo một Button native đơn giản tương tự Button web bạn dùng
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
  id: string;
  name: string;
  countSong: number;
  colors: string[];
}
const HomePage = () => {
  const router = useRouter();
  const { songs = [], playSong } = useMusicContext();
  const [featuredPlaylists, setFeaturedPlaylists] = useState<FeaturedPlaylist[]>([]);
  const recentSongs = songs.slice(0, 4);
  

      useEffect(() => {
      const getData = async () => {
        try {
          const data = await fetchPlaylists();

          const withColors: FeaturedPlaylist[] = data.map((p: any, i: number) => ({
            id: p._id || p.id,
            name: p.name,
            countSong: p.countSong || 0,
            colors: colorsPool[i % colorsPool.length],
          }));

          setFeaturedPlaylists(withColors);
        } catch (err) {
          console.error('Fetch playlist error:', err);
        }
      };

      getData();
    }, []);

  return (
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
          backgroundColor: '#7C3AED',
          overflow: 'hidden',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Discover New Music</Text>
        <Text style={{ fontSize: 14, color: '#E0E0E0', marginBottom: 16 }}>
          Listen to the latest hits and your favorite artists
        </Text>
        <Button
          onPress={() => router.push('/playlist/list-playlist')}
          style={{ backgroundColor: 'white' }}
        >
          <Play color="#7C3AED" size={16} />
          <Text style={{ color: '#7C3AED', fontWeight: '600', marginLeft: 8 }}>Start Listening</Text>
        </Button>
      </Animated.View>

      {/* Recently Played */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Disc size={20} color="white" />
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginLeft: 8 }}>
          Recently Played
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {recentSongs.length > 0 ? recentSongs.map((song) => (
          <TouchableOpacity
            key={song.id}
            style={{
              width: '48%',
              backgroundColor: '#1F2937',
              borderRadius: 12,
              padding: 10,
              marginBottom: 12,
            }}
            onPress={() => playSong(song)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1668791871017-989a35d2e0cf' }}
              style={{
                width: '100%',
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
        )) : (
          <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>No recently played songs</Text>
        )}
      </View>

      {/* Featured Playlists */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Music size={20} color="white" />
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginLeft: 8 }}>
          Featured Playlists
        </Text>
      </View>
      <View>
        {featuredPlaylists.map((playlist, index) => (
        <Animated.View
          key={playlist.id}
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
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{playlist.name}</Text>
            <Text style={{ color: '#F0F0F0', fontSize: 12 }}>{playlist.countSong} songs</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: 8,
              borderRadius: 8,
            }}
            activeOpacity={0.7}
            onPress={() => {
              // Bạn có thể thêm logic cho playlist ở đây
            }}
          >
            <Play color="white" size={16} />
          </TouchableOpacity>
        </Animated.View>
      ))}
      </View>
      
    </ScrollView>
  );
};

export default HomePage;
