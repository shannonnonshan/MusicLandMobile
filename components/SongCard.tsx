import type { Song } from '@/contexts/MusicContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { Heart, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SongCardModal from './SongCardModal';
type SongCardProps = {
  song: Song;
  index: number;
  onPress: () => void;
  playlistId?: string;
  onAction?: () => void;
};

const SongCard: React.FC<SongCardProps> = ({ song, index, onPress, playlistId, onAction }) => {
  const { currentSong, isPlaying, toggleLike, formatTime } = useMusicContext();

  const isActive = currentSong && currentSong.id === song.id;
  const [modalVisible, setModalVisible] = useState(false);
  return (
  <>
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        isActive ? styles.activeBackground : styles.inactiveBackground,
      ]}
      activeOpacity={0.8}
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
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            toggleLike(Number(song.id));
          }}
        >
          <Heart
            size={18}
            color={song.liked ? 'red' : '#999'}
            fill={song.liked ? 'red' : 'none'}
          />
        </TouchableOpacity>

        <Text style={styles.duration}>{formatTime(song.duration)}</Text>

        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setModalVisible(true)}
          >
            <MoreVertical size={20} color="#6b21a8" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    <SongCardModal
        visible={modalVisible}
        song = {song}
        playlistId={playlistId} 
        onClose={() => setModalVisible(false)}
        onAction={onAction}
      />
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuButton: {
  padding: 8,
  backgroundColor: "#f3e8ff",
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
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
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingButton: {
    backgroundColor: '#6b21a8',
  },
  pausedButton: {
    backgroundColor: '#eee',
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},

modalContainer: {
  width: 280,
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 12,
  textAlign: 'center',
},

modalOption: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},

modalCancel: {
  marginTop: 12,
  alignItems: 'center',
},

});

export default SongCard;
