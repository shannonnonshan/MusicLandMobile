import { searchTracksByIds } from '@/axios/deezer.api';
import { baseURL } from '@/axios/platform.api';
import { addSongToPlaylist, getPlaylistTracks } from '@/axios/playlist';
import SongCard from '@/components/SongCard';
import { Song, useMusicContext } from '@/contexts/MusicContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pencil, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import SelectSongsModal from '@/components/SelectSongModal';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AlbumPage = () => {
  const { playSong } = useMusicContext();
  const { playlistId } = useLocalSearchParams();
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumThumbnail, setAlbumThumbnail] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!playlistId) return;

    const fetchAlbumSongs = async () => {
      try {
        setLoading(true);
        const playlist = await getPlaylistTracks(playlistId as string);

        const [songs] = await Promise.all([
          searchTracksByIds(playlist.songs),
        ]);

        setAlbumTitle(playlist.name);
        setAlbumSongs(songs as any);
        setAlbumThumbnail(`${baseURL.replace('/api', '')}${playlist.coverImage}`);
      } catch (error) {
        console.error('Error fetching album songs or playlist detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumSongs();
  }, [playlistId]);

  const handleAddSongs = async (songs: Song[]) => {
    if (!playlistId) return;

    const songIds = songs.map(song => song.id);

    try {
      const result = await addSongToPlaylist(playlistId, songIds);
      console.log('Add songs result:', result);
      setShowModal(false);
      const playlist = await getPlaylistTracks(playlistId as string);
      const songPlaylist = await searchTracksByIds(playlist.songs);
      setAlbumSongs(songPlaylist as Song[]);
    } catch (error) {
      console.error('Failed to add songs:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: albumTitle || 'Album',
          headerTitleStyle: { color: '#fff' },
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#111' },
        }}
      />

      <View className="flex-1 bg-black px-4 py-6 pb-20">
        {/* Header */}
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
        {loading ? 
        (
          <ActivityIndicator size="large" color="#7C3AED" className="mt-20" />
        ) : albumSongs.length > 0 ? (
          <FlatList
            data={albumSongs}
            renderItem={({ item, index }) => (
              <SongCard song={item} index={index} onPress={() => playSong(item)} />
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
      </View>
    </>
  );
};

export default AlbumPage;
