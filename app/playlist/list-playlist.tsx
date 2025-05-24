import { initialPlaylist } from '@/lib/playlistStorage';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
const mockPlaylists = initialPlaylist;

export default function ListPlaylistView() {
  const [featuredPlaylists, setFeaturedPlaylists] = useState<typeof mockPlaylists>([]);
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setFeaturedPlaylists(mockPlaylists);
    }, 500);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="h-[66px] pb-2 relative mb-3 flex flex-col justify-between">
        <Pressable
          onPress={() => {
            try {
                router.back();
            } catch {
                router.push('/home');
            }
          }}
          className="absolute left-5 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 p-2"
        >
          <Entypo name="chevron-small-left" size={20} color="white" />
        </Pressable>

        <View className="absolute top-1/2 left-0 right-0 -translate-y-1/2 items-center">
          <Text className="text-white text-lg font-semibold">Your Playlist</Text>
        </View>

        <Pressable className="absolute right-5 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 p-2">
          <Entypo name="add-to-list" size={20} color="white" />
        </Pressable>
      </View>

      {/* Playlist List */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 80, minHeight: screenHeight }}
      >
        {featuredPlaylists.map((playlist, index) => (
          <Animated.View
            key={playlist.id}
            entering={SlideInLeft.delay(300 + index * 100)}
            className="rounded-xl overflow-hidden mb-4 flex-row items-center px-3 py-3 shadow-md"
            style={{ backgroundColor: playlist.colors?.[0] || '#555', elevation: 4 }}
          >
            <Image
              source={{ uri: playlist.coverImage }}
              className="w-14 h-14 rounded-lg mr-3"
            />

            <View className="flex-1">
              <Text className="text-white font-bold text-base">{playlist.name}</Text>
              <Text className="text-[#F0F0F0] text-xs">{playlist.countSong} songs</Text>
            </View>

            <Pressable
              onPress={() => {
                console.log(`Play playlist ${playlist.name}`);
                router.push(`/playlist/${playlist.id}`);
              }}
              className="rounded-lg p-2"
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              })}
            >
              <Play color="white" size={18} />
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
