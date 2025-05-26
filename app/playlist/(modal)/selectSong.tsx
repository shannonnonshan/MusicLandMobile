import { getTopCharts, searchMulti } from '@/axios/deezer.api';
import SongPlaylistCard from '@/components/SongPlaylistCard';
import type { Song } from '@/contexts/MusicContext';
import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (songs: Song[]) => void;
}

export default function SelectSongsModal({ visible, onClose, onConfirm }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackResults, setTrackResults] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

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
    onConfirm(selectedSongs);
    setSearchQuery('');
    setSelectedSongs([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search songs..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.count}>Selected: {selectedSongs.length} song(s)</Text>

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

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 0.9,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 16,
  },
  input: {
    color: 'white',
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    marginTop: 10,
  },
  count: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  selected: {
    borderColor: '#4ade80',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    padding: 10,
    alignSelf: 'center',
  },
});
