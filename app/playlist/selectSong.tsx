import SongPlaylistCard from '@/components/SongPlaylistCard';
import type { Song } from '@/contexts/MusicContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getTopCharts, searchMulti } from '../../axios/deezer.api';

export default function SelectSongsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [trackResults, setTrackResults] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const { name, description, image } = useLocalSearchParams();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchQuery.trim()) {
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
          setTrackResults(mappedTracks);
        });
      } else {
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
          setTrackResults(mappedTracks);
        });
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const toggleSelect = (song: Song) => {
    setSelectedSongs((prev) =>
      prev.find((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  const handleConfirm = () => {
  router.push({
    pathname: '/library' as any,
    params: {
      selectedSongs: JSON.stringify(selectedSongs), // truyền toàn bộ mảng bài hát
    },
  });
};
  

  return (
    <SafeAreaView style={styles.container}>
      <View className="px-4">
        <TextInput
          className="text-white bg-[#222] rounded-lg pr-3 py-2 pl-4 text-xl"
          placeholder="Search songs..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text className="text-white pt-2 pb-3 text-xl mt-4">
          Selected: {selectedSongs.length} song(s)
        </Text>
      </View>

      <ScrollView style={{ marginBottom: 80 }}>
        {trackResults.map((track, index) => {
          const isSelected = selectedSongs.find((s) => s.id === track.id);
          return (
            <TouchableOpacity key={track.id} onPress={() => toggleSelect(track)}>
              <View style={isSelected ? styles.selected : {}}>
                <SongPlaylistCard
                    song={track}
                    index={index}
                    isSelected={!!isSelected}
                    onPress={() => toggleSelect(track)}
                />

              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-4 left-4 right-4 bg-green-500 p-4 rounded-xl"
        onPress={handleConfirm}
      >
        <Text className="text-white text-center text-xl font-semibold">Confirm Selection</Text>
      </TouchableOpacity>
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
  selected: {
    borderColor: '#4ade80',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
  },
});
