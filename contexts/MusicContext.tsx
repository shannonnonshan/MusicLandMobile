import { useToast } from '@/components/ui/use-toast';
import {
  initialSongs,
  loadSongsFromStorage,
  saveSongsToStorage
} from '@/lib/musicStorage';
import { formatTime } from '@/lib/timeUtils';
import { Audio } from 'expo-av';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  liked: boolean;
  thumbnail: string;
  uri: string; // Thêm trường uri để lưu đường dẫn file âm thanh
}
export interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  songs: Song[];
}

interface MusicContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;
  currentTime: number;
  thumbnail: string;
  uri: string;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  seekTo: (percent: number) => void;
  setVolume: (value: number) => void;
  toggleLike: (id: number) => void;
  formatTime: (time: number) => string;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8); // expo-av volume 0 to 1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const load = async () => {
      const loadedSongs = await loadSongsFromStorage();
      if (loadedSongs && loadedSongs.length > 0) {
        setSongs(loadedSongs);
      } else {
        setSongs(initialSongs);
        await saveSongsToStorage(initialSongs);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      saveSongsToStorage(songs);
    }
  }, [songs]);

  useEffect(() => {
    // Cleanup sound on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Load and play sound when currentSong changes
  useEffect(() => {
    const loadAndPlay = async () => {
      try {
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        if (currentSong) {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: currentSong.uri },
            { shouldPlay: isPlaying, volume }
          );

          newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
          setSound(newSound);
        }
      } catch (error) {
        toast({
          title: 'Audio Load Error',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    };

    loadAndPlay();
  }, [currentSong]);

  // Update volume on sound object when volume changes
  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume);
    }
  }, [volume, sound]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      if (status.error) {
        toast({
          title: 'Playback Error',
          description: status.error,
          variant: 'destructive',
        });
      }
      return;
    }
    setIsPlaying(status.isPlaying);
    setCurrentTime(status.positionMillis / 1000);
    setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
    setProgress(
      status.durationMillis
        ? (status.positionMillis / status.durationMillis) * 100
        : 0
    );

    if (status.didJustFinish && !status.isLooping) {
      playNextSong();
    }
  };

  const playSong = async (song: Song) => {
    if (!song) return;

    if (currentSong && currentSong.id === song.id) {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      // Sound sẽ tự load và play ở useEffect phía trên
    }
  };

  const pauseSong = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const playNextSong = useCallback(async () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    await playSong(songs[nextIndex]);
  }, [currentSong, songs]);

  const playPreviousSong = useCallback(async () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    await playSong(songs[prevIndex]);
  }, [currentSong, songs]);

  const seekTo = async (percent: number) => {
    if (sound && duration > 0) {
      const seekPosition = (percent / 100) * 30 * 1000;
      await sound.setPositionAsync(seekPosition);
      setProgress(percent);
      setCurrentTime(seekPosition / 1000);
    }
  };

  const toggleLike = (songId: number) => {
    setSongs((prevSongs) => {
      const updatedSongs = prevSongs.map((song) =>
        song.id === String(songId) ? { ...song, liked: !song.liked } : song
      );

      // Update currentSong nếu nó là bài được toggle
      if (currentSong && currentSong.id === String(songId)) {
        setCurrentSong(updatedSongs.find(song => Number(song.id) === songId) || null);
      }

      return updatedSongs;
    });
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        progress,
        volume: volume * 100, // UI 0-100
        duration,
        currentTime,
        thumbnail: currentSong?.thumbnail || '',
        uri: currentSong?.uri || '',
        playSong,
        pauseSong,
        playNextSong,
        playPreviousSong,
        seekTo,
        setVolume: (val) => setVolume(val / 100), // UI 0-100 => 0-1
        toggleLike,
        formatTime,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
