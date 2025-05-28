import { searchTracksByIds } from '@/axios/deezer.api';
import { baseURL } from '@/axios/platform.api';
import { addSongToPlaylist, getPlaylistTracks } from '@/axios/playlist';
import SelectSongsModal from '@/components/SelectSongModal';
import SongCard from '@/components/SongCard';
import UpdatePlaylistModal from '@/components/UpdatePlaylistModal';
import { Song, useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil, Plus } from 'lucide-react-native';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const AlbumPage = () => {
  const router = useRouter();
  
  const { playSong, currentPlaylist, setCurrentPlaylist } = useMusicContext();
  const { playlistId } = useLocalSearchParams();
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumThumbnail, setAlbumThumbnail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const fetchAlbumSongs = async () => {
  if (!playlistId) return;

  try {
    setLoading(true);
    const playlist = await getPlaylistTracks(playlistId as string);
    const songs = await searchTracksByIds(playlist.songs);

    setAlbumTitle(playlist.name);
    setAlbumSongs(songs as Song[]);
    setAlbumThumbnail(`${baseURL.replace('/api', '')}${playlist.coverImage}`);
     setCurrentPlaylist({ ...playlist, songs });
  } catch (error) {
    console.error('Error fetching album songs or playlist detail:', error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchAlbumSongs();
}, [playlistId]);

  const handleAddSongs = async (songs: Song[]) => {
    if (!playlistId) return;
    
    const songIds = songs.map(song => song.id);

    try {
      const result = await addSongToPlaylist(playlistId, songIds);
      console.log('Add songs result:', result);
      setShowModal(false);

      // Cập nhật lại danh sách sau khi thêm
      const playlist = await getPlaylistTracks(playlistId as string);
      const songPlaylist = await searchTracksByIds(playlist.songs);

      setCurrentPlaylist({ ...playlist, songs: songPlaylist });
      setAlbumSongs(songPlaylist as Song[]);
    } catch (error) {
      console.error('Failed to add songs:', error);
    }
  };
  useLayoutEffect(() => {
      if (albumTitle) {
      navigation.setOptions({
          title: albumTitle,
          headerTitleStyle: {
          color: '#fff',},
          headerTintColor: '#fff',
          headerStyle: {
          backgroundColor: '#111'}
      });
      }
  }, [navigation, albumTitle])

  return (
    <>
      {/* Header */}
      <View className="flex-1 bg-black px-4 py-6 pb-20">
        <View className="flex-row items-center space-x-2 px-4 py-2 bg-black mt-10">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Entypo name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-semibold">
             {currentPlaylist?.name || 'Playlist'}
          </Text>
        </View>

        <View className="flex-col items-center mb-6 justify-between">
          <Image
            source={{ uri: albumThumbnail }}
            style={{ width: 200, height: 200, borderRadius: 12 }}
          />
          <Text className="text-2xl font-bold text-white mt-4">
            {albumTitle || 'Album'}
          </Text>
          <View className="flex-row mt-4 space-x-4 gap-2 self-start">
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="bg-gray-800 px-4 py-2 rounded-xl flex-row items-center"
            >
              <Plus color="white" size={18} />
              <Text className="text-white font-semibold ml-2">Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEditModal(true);
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
              <SongCard song={item} index={index} onPress={() => playSong(item)} playlistId={playlistId as string} onAction={()=>fetchAlbumSongs()}/>
            )}
            ItemSeparatorComponent={() => <View className="h-1" />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 85 }}
          />
        ) : (
          <View className="py-10 items-center">
            <Text className="text-gray-500 text-center text-base">
              No songs found in this playlist
            </Text>
          </View>
        )}

        <SelectSongsModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleAddSongs}
        />
         <UpdatePlaylistModal
          visible={editModal}
          onClose={() => setEditModal(false)}
          onUpdated={() => {
            fetchAlbumSongs()
              setEditModal(false);
          }}
          playlistId={playlistId as string}
        />
      </View>
     
    </>
  );
};

export default AlbumPage;
