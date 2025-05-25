import type { Song } from '@/contexts/MusicContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SongPlaylistCardProps = {
  song: Song;
  index: number;
  onPress: () => void;
  isSelected: boolean;
};

const SongPlaylistCard: React.FC<SongPlaylistCardProps> = ({ song, index, onPress, isSelected }) => {
  const { currentSong, formatTime } = useMusicContext();

  const isActive = currentSong && currentSong.id === song.id;

  return (
    <View
      style={[
        styles.container,
        isActive ? styles.activeBackground : styles.inactiveBackground,
      ]}
    >
      <Image
        source={{ uri: song.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>

      <View style={styles.controls}>
        <Text style={styles.duration}>{formatTime(song.duration)}</Text>

        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.addButton,
            isSelected && styles.addedButton,
          ]}
        >
          <Plus size={18} color={isSelected ? 'white' : '#6b21a8'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  activeBackground: {
    backgroundColor: '#6b21a8',
  },
  inactiveBackground: {
    backgroundColor: '#222',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: 'white',
    fontWeight: '600',
  },
  activeText: {
    color: '#d8b4fe',
  },
  artist: {
    color: '#bbb',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    color: '#bbb',
    fontSize: 12,
    marginHorizontal: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#6b21a8',
  },
});

export default SongPlaylistCard;
