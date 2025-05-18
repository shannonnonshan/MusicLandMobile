import type { Song } from '@/contexts/MusicContext';
import { useMusicContext } from '@/contexts/MusicContext';
import { useRouter } from 'expo-router';
import { Heart, Pause, Play } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


type SongCardProps = {
  song: Song;
  index: number;
};

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const { currentSong, isPlaying, playSong, toggleLike, formatTime } = useMusicContext();
  const router = useRouter();
  const isActive = currentSong && currentSong.id === song.id;

  return (
    <TouchableOpacity
      onPress={() => {
        playSong(song)
        router.push(`/player?$(song.id)`); // hoặc '/player/[id]' nếu có trang chi tiết bài hát
      }}
      style={[
        styles.container,
        isActive ? styles.activeBackground : styles.inactiveBackground,
      ]}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1632667113908-10f5dbafa8a1' }}
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
            e.stopPropagation && e.stopPropagation();
            toggleLike(song.id);
          }}
        >
          <Heart
            size={18}
            color={song.liked ? 'red' : '#999'}
            fill={song.liked ? 'red' : 'none'}
          />
        </TouchableOpacity>

        <Text style={styles.duration}>{formatTime(song.duration)}</Text>

        <View
          style={[
            styles.playButton,
            isActive && isPlaying ? styles.playingButton : styles.pausedButton,
          ]}
        >
          {isActive && isPlaying ? <Pause size={16} color="white" /> : <Play size={16} color="#6b21a8" />}
        </View>
      </View>
    </TouchableOpacity>
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
});

export default SongCard;
