// ... các import không thay đổi
import { getRandomSongFromAPI } from '@/axios/deezer.api';
import { useToast } from '@/components/ui/use-toast';
import {
  saveSongsToStorage
} from '@/lib/musicStorage';
import { formatTime } from '@/lib/timeUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  liked: boolean;
  thumbnail: string;
  uri: string; // Thêm trường uri để lưu đường dẫn file âm thanh
  genre: string;
  releaseYear: string;
}
export interface Album {
  id: string;
  name: string;
  artist: string;
  thumbnail: string;
  songs: Song[];
}
export interface Playlist {
  _id: string;
  name: string;
  coverImage?: string;
  songs?: Song[];
  createdBy?: string;
  createdAt?: Date;
  countSong?: number;
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
  currentPlaylist: Playlist | Album | null;
  setCurrentPlaylist: (playlist: Playlist | Album) => void;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void; // ✅ mới thêm
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

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // useEffect(() => {
  //   const load = async () => {
  //     const loadedSongs = await loadSongsFromStorage();
  //     if (loadedSongs?.length > 0) {
  //       setSongs(loadedSongs);
  //     } else {
  //       setSongs(initialSongs);
  //       await saveSongsToStorage(initialSongs);
  //     }
  //   };
  //   load();
  // }, []);

  useEffect(() => {
    if (songs.length > 0) saveSongsToStorage(songs);
  }, [songs]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
          { shouldPlay: true, volume } // 🔥 Force autoplay
        );

        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        setSound(newSound);
        setIsPlaying(true); // ✅ Ensure state is in sync
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


  useEffect(() => {
    if (sound) sound.setVolumeAsync(volume);
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

    if (currentSong?.id === song.id) {
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
      setCurrentSong((prev) => (prev?.id === song.id ? prev : song));
    }

    try {
      const key = 'recentSongs';
      const recentJSON = await AsyncStorage.getItem(key);
      let recent: Song[] = recentJSON ? JSON.parse(recentJSON) : [];
      recent = [song, ...recent.filter((s) => s.id !== song.id)].slice(0, 10);
      await AsyncStorage.setItem(key, JSON.stringify(recent));
    } catch (err) {
      console.error('Lỗi khi lưu bài hát nghe gần đây:', err);
    }
  };

  const pauseSong = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const playNextSong = useCallback(async () => {
    const playlistSongs = currentPlaylist?.songs || songs;
    if (!currentSong || playlistSongs.length === 0) {
      const songs = await getRandomSongFromAPI();
      if (songs) {
        setTimeout(() => {
          playSong(songs);
        }, 50);
      }
      return;
    };
    const currentIndex = playlistSongs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlistSongs.length;
    await playSong(playlistSongs[nextIndex]);
  }, [currentSong, currentPlaylist, songs]);

  const playPreviousSong = useCallback(async () => {
    const playlistSongs = currentPlaylist?.songs || songs;
    if (!currentSong || playlistSongs.length === 0) return;
    const currentIndex = playlistSongs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlistSongs.length) % playlistSongs.length;
    await playSong(playlistSongs[prevIndex]);
  }, [currentSong, currentPlaylist, songs]);

  const seekTo = async (percent: number) => {
    if (sound && duration > 0) {
      const position = (percent / 100) * duration * 1000;
      await sound.setPositionAsync(position);
      setProgress(percent);
      setCurrentTime(position / 1000);
    }
  };

  const toggleLike = (songId: number) => {
    setSongs((prev) => {
      const updated = prev.map((song) =>
        song.id === String(songId) ? { ...song, liked: !song.liked } : song
      );
      if (currentSong && currentSong.id === String(songId)) {
        setCurrentSong(updated.find((s) => s.id === currentSong.id) || null);
      }
      return updated;
    });
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        progress,
        volume: volume * 100,
        duration,
        currentTime,
        thumbnail: currentSong?.thumbnail || '',
        uri: currentSong?.uri || '',
        currentPlaylist,
        setCurrentPlaylist,
        playSong,
        pauseSong,
        togglePlayPause, // ✅ truyền ra context
        playNextSong,
        playPreviousSong,
        seekTo,
        setVolume: (v) => setVolume(v / 100),
        toggleLike,
        formatTime,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
