import { baseURL } from '@/axios/platform.api';
import { getPlaylistTracks } from '@/axios/playlist'; // giả định có API lấy chi tiết playlist
import SongCard from '@/components/SongCard';
import { useMusicContext } from '@/contexts/MusicContext';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Pencil, Plus } from 'lucide-react-native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
const AlbumPage = () => {
  const { playSong } = useMusicContext();
  const { playlistId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [albumTitle, setAlbumTitle] = useState('');
  const [albumSongs, setAlbumSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumThumbnail, setAlbumThumbnail] = useState('');

  useEffect(() => {
    if (!playlistId) return;

    const fetchAlbumSongs = async () => {
      try {
        setLoading(true);

        // Fetch album tracks (như hiện tại)
        const playlist = await getPlaylistTracks(playlistId as string);
        console.log(playlist);
        setAlbumTitle(playlist.name);
        setAlbumSongs(playlist.songs);
        setAlbumThumbnail(`${baseURL.replace('/api', '')}${playlist.coverImage}` );
      } catch (error) {
        console.error('Error fetching album songs or playlist detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumSongs();
  }, [playlistId]);

  useLayoutEffect(() => {
    if (albumTitle) {
      navigation.setOptions({
        title: albumTitle,
        headerTitleStyle: {
          color: '#fff',
        },
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#111'
        }
      });
    }
  }, [navigation, albumTitle]);

  return (
    <View className="flex-1 bg-black px-4 py-6 pb-20">
      {/* Header */}
      <View className="flex-col items-center mb-6 justify-between">
        <Image
          source={{ uri: albumThumbnail }}
          style={{ width: 200, height: 200, borderRadius: 12 }}
        />

        {/* Nút Add và Edit bên dưới hình */}
        <Text className="text-2xl font-bold text-white mt-4">{albumTitle || 'Album'}</Text>
        <View className="flex-row ml-5 mt-4 space-x-6">
          {/* Add button */}
          <TouchableOpacity
            onPress={() => {
              console.log('Add button pressed');
            }}
            className="bg-gray-800 px-4 py-2 rounded-xl flex-row items-center"
          >
            <Plus color="white" size={18} />
            <Text className="text-white font-semibold ml-2">Add</Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              console.log('Edit button pressed');
            }}
            className="bg-gray-800 px-4 py-2 rounded-xl flex-row items-center"
          >
            <Pencil color="white" size={16} />
            <Text className="text-white font-semibold ml-2">Edit</Text>
          </TouchableOpacity>
        </View>


      </View>

      {/* Danh sách bài hát */}
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" className="mt-20" />
      ) : albumSongs.length > 0 ? (
        <FlatList
          data={albumSongs}
          renderItem={({ item, index }) => (
            <SongCard
              song={item}
              index={index}
              onPress={() => playSong(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-1" />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="py-10 items-center">
          <Text className="text-gray-500 text-center text-base">No songs found in this playlists</Text>
        </View>
      )}
    </View>
  );
};

export default AlbumPage;
