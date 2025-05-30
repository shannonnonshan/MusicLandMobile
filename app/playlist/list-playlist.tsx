import { baseURL } from '@/axios/platform.api';
import { deletePlaylist, getPlaylists, searchPlaylists } from '@/axios/playlist';
import PlayerAddSongCard from '@/components/PlayerAddSongCard';
import { useDeviceId } from '@/contexts/DeviceContext';
import { Playlist, Song, useMusicContext } from '@/contexts/MusicContext';
import { Entypo, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateScreen from './(modal)/create';

export default function ListPlaylistView() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  const { deviceId, loading } = useDeviceId();
  const { setCurrentPlaylist } = useMusicContext();

  const { isPlayer, song: rawSong} = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

  let song: Song | undefined = undefined;
  try {
  song = JSON.parse(rawSong as string);
  }
  catch (error) {
  }
  useEffect(() => {
  fetchPlaylists();
}, [searchQuery, deviceId, loading]);

  const fetchPlaylists = async () => {
    try {
      if (loading) return;
      if (!deviceId) return;

      let data: Playlist[] = [];

      if (searchQuery.trim()) {
        data = await searchPlaylists(deviceId, searchQuery.trim());
      } else {
        data = await getPlaylists(deviceId);
      }

      setPlaylists(data);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [loading])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Header */}
      <View style={{ height: 66, paddingBottom: 8, marginBottom: 12, justifyContent: 'center' }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: [{ translateY: -10 }],
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 8,
            borderRadius: 8,
          }}
          hitSlop={10}
        >
          <Entypo name="chevron-small-left" size={20} color="white" />
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            Your Playlist
          </Text>
        </View>
          
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: [{ translateY: -10 }],
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Entypo name="add-to-list" size={20} color="white" />
        </Pressable>
      </View>
        <View className="pt-2 w-full bg-[#000] px-4">
          <TextInput
            className="text-[#fff] bg-[#222] rounded-lg pr-3 py-2  pl-4 text-xl"
            placeholder="Search songs, artists, albums..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text className="text-[#fff] pt-2 pb-3 text-xl mt-5 z-10">
            Search result for: {searchQuery}
          </Text>
        </View>
      <ScrollView
  contentContainerStyle={{ padding: 16, paddingBottom: 80, minHeight: screenHeight }}
>
  {playlists.map((playlist, index) => {
    const isDeleteMode = showDeleteId === playlist._id;

    // Nếu đang trong Player Mode
    if (isPlayer) {
      return (
        <PlayerAddSongCard
          key={playlist._id}
          playlist={playlist}
          index={index}
          song={song ?? undefined}
          onAction={() => {
            fetchPlaylists();}}
        />
      );
    }

    // Nếu không phải Player Mode
    return (
      <Pressable
        key={playlist._id}
        onPress={() => {
          if (isDeleteMode) return;
          setCurrentPlaylist(playlist);
          router.push({
            pathname: '/playlist/library',
            params: { playlistId: playlist._id.toString() },
          });
        }}
        onLongPress={() => {
          setShowDeleteId(playlist._id);
        }}
        delayLongPress={600}
      >
        <Animated.View
          entering={SlideInLeft.delay(300 + index * 100)}
          style={{
            backgroundColor: isDeleteMode ? '#b00020' : '#555',
            elevation: 4,
            height: 70,
            borderRadius: 12,
            marginBottom: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: `${baseURL.replace('/api', '')}${playlist.coverImage}` }}
            style={{ width: 45, height: 45, borderRadius: 12, marginRight: 12 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {playlist.name}
            </Text>
            <Text style={{ color: '#F0F0F0', fontSize: 12 }}>
              {playlist.countSong} song{playlist.countSong !== 1 ? 's' : ''}
            </Text>
          </View>

          {isDeleteMode ? (
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Delete Playlist',
                  `Are you sure you want to delete "${playlist.name}"?`,
                  [
                    { text: 'Cancel', onPress: () => setShowDeleteId(null), style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deletePlaylist(playlist._id);
                          await fetchPlaylists();
                          setShowDeleteId(null);
                        } catch (err) {
                          console.error('Failed to delete playlist:', err);
                        }
                      },
                    },
                  ]
                );
              }}
              style={{ padding: 8 }}
            >
              <Feather name="trash-2" size={20} color="white" />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setCurrentPlaylist(playlist)}
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                backgroundColor: pressed
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.2)',
              })}
            >
              <Entypo name="controller-play" size={18} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    );
  })}
</ScrollView>

      {/* Modal Popup Create Playlist */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 400,
              maxHeight: '80%',
              backgroundColor: '#121212',
              borderRadius: 16,
              overflow: 'hidden',
              elevation: 20,
            }}
          >
            <CreateScreen
              onClose={() => setModalVisible(false)}
              onCreated={() => {
                fetchPlaylists();
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
  }
