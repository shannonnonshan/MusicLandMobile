import { getAlbumTracks } from '@/axios/deezer.api';
import SongCard from '@/components/SongCard';
import { useMusicContext } from '@/contexts/MusicContext';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Text, View } from 'react-native';
const AlbumPage = () => {
  const { playSong } = useMusicContext();
  const { albumId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumSongs, setAlbumSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumThumbnail, setAlbumThumbnail] = useState('');
  const screenHeight = Dimensions.get('window').height; // Assuming a fixed height for simplicity, you can use Dimensions API for dynamic height
  useEffect(() => {
    if (!albumId) return;

    const fetchAlbumSongs = async () => {
      try {
        setLoading(true);
        const { albumTitle,albumThumbnail, songs } = await getAlbumTracks(Number(albumId));
        setAlbumTitle(albumTitle);
        setAlbumSongs(songs);
        setAlbumThumbnail(albumThumbnail);
      } catch (error) {
        console.error('Error fetching album songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumSongs();
  }, [albumId]);
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
    <View className="flex-1 bg-black px-4 py-12 pb-20 ">
      {/* Header */}
      <View className="flex-col items-center mb-6 justify-between">
           <Image
                source={{ uri: albumThumbnail }}
                style={{ width: 200, height: 200, borderRadius: 12 }}
            />  
        <Text className="text-2xl font-bold text-white">{albumTitle || 'Album'}</Text>
      </View>
      {/* Danh sách bài hát */}
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" className="mt-20 pb-12" />
      ) : albumSongs.length > 0 ? (
       
        <FlatList
          data={albumSongs}
          contentContainerStyle={{ paddingBottom: 80, minHeight: screenHeight - 200 }}
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
          <Text className="text-gray-500 text-center text-base">No songs found in this album</Text>
        </View>
      )}
    </View>
  );
};

export default AlbumPage;
