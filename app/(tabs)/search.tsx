import SongCard from '@/components/SongCard';
import type { Album, Song } from '@/contexts/MusicContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
//import { searchTracks } from '../../axios/sporitfy.api';
import AlbumCard from '@/components/AlbumCard';
import { getTopCharts, searchMulti } from '../../axios/deezer.api';
import '../../global.css';
export default function TabSearchScreen() {
  const { playSong } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [trackResults, setTrackResults] = useState<Song[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);

  
  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (!searchQuery.trim()) {
      // Gọi top charts khi không có gì được nhập
      getTopCharts().then((res) => {
        const mappedTracks: Song[] = res.tracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          album: track.album?.title || 'Unknown Album',
          duration: track.duration || 0,
          liked: false,
          thumbnail: track.album?.cover || '',
          uri: track.preview || '',
        }));

        const mappedAlbums: Album[] = res.albums.map((album: any) => ({
          id: album.id,
          title: album.title,
          artist: album.artist?.name || 'Unknown Artist',
          album: album.title,
          thumbnail: album.cover_medium || '',
          song: album.tracks || [],
        }));

        setTrackResults(mappedTracks);
        setAlbumResults(mappedAlbums);
      });
    } else {
      // Gọi tìm kiếm thông thường
      searchMulti(searchQuery).then((res) => {
        const mappedTracks: Song[] = res.tracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          album: track.album?.title || 'Unknown Album',
          duration: track.duration || 0,
          liked: false,
          thumbnail: track.album?.cover || '',
          uri: track.preview || '',
        }));

        const mappedAlbums: Album[] = res.albums.map((album: any) => ({
          id: album.id,
          title: album.title,
          artist: album.artist?.name || 'Unknown Artist',
          album: album.title,
          thumbnail: album.cover_medium || '',
          song: album.tracks || [],
        }));

        setTrackResults(mappedTracks);
        setAlbumResults(mappedAlbums);
      });
    }
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cố định */}
      <View className="bg-[#000]">
        <View className="flex-row items-center justify-start px-4">
          <Image
            source={require('../../assets/images/MSlogo.png')}
            style={{ width: 60, height: 60 }}
          />
          <Text className="text-[#fff] text-2xl font-bold">Search</Text>
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
      </View>
     
     
      {/* Kết quả tìm kiếm */}
      <ScrollView style={{marginBottom: 150}}>
        {albumResults.length > 0 && (
              <>
                <Text className="text-white text-xl font-bold px-4 mt-6 mb-2">Albums</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal:4}}
                >
                  {albumResults.map((album, index) => (
                    <AlbumCard
                      key={`album-${album.id}`}
                      album={album}
                      onPress={() => {}}
                    />
                  ))}
                </ScrollView>
              </>
            )}

        {trackResults.length > 0 && (
            <>
              <Text className="text-white text-xl font-bold px-4 mt-4 mb-2">Songs</Text>
              {trackResults.map((track, index) => (
                <SongCard key={`track-${track.id}`} song={track} index={index} onPress={() => playSong(track)} />
              ))}
            </>
          )}

      </ScrollView>
    </SafeAreaView>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: STATUS_BAR_HEIGHT + 10,
  },
});