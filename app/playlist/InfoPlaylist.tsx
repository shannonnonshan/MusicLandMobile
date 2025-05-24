import SongPlaylistCard from '@/components/SongPlaylistCard';
import type { Song } from '@/contexts/MusicContext';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function InfoPlaylist() {
  const params = useLocalSearchParams();
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!params.selectedSongs) return;

    try {
      const songs: Song[] = JSON.parse(
        Array.isArray(params.selectedSongs) ? params.selectedSongs[0] : params.selectedSongs
      );
      setPlaylistSongs(songs);
    } catch (error) {
      console.error('Failed to parse selected songs:', error);
    }
  }, [params.selectedSongs]);

  if (playlistSongs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No songs in playlist.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlist</Text>
      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <SongPlaylistCard song={item} index={index} onPress={() => {}} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
