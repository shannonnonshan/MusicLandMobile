import { useToast } from '@/src/components/ui/use-toast';
import {
  initialSongs,
  loadSongsFromStorage,
  saveSongsToStorage,
} from '@/src/lib/musicStorage';
import { formatTime } from '@/src/lib/timeUtils';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import TrackPlayer, {
  Capability,
  Event,
  State,
  Track,
} from 'react-native-track-player';

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  liked: boolean;
}

interface MusicContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;
  currentTime: number;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  seekTo: (percent: number) => void;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  toggleLike: (songId: number) => void;
  formatTime: (seconds: number) => string;
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
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const setup = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
        Capability?.Play,
        Capability?.Pause,
        Capability?.SkipToNext,
        Capability?.SkipToPrevious,
        Capability?.SeekTo,
      ],
      });

    };
    setup();
  }, []);

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

  // Event listener to update isPlaying state
  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackState,
      ({ state }) => {
        setIsPlaying(state === State.Playing);
      }
    );
    return () => listener.remove();
  }, []);

  const playSong = async (song: Song) => {
    try {
      const track: Track = {
        id: `${song.id}`,
        url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
      };

      await TrackPlayer.reset();
      await TrackPlayer.add([track]);
      await TrackPlayer.play();

      setCurrentSong(song);
    } catch (error) {
      toast({
        title: 'Playback Error',
        description:
          'Could not play this song. This is a demo app without actual audio files.',
        variant: 'destructive',
      });
      setIsPlaying(false);
    }
  };

  const pauseSong = async () => {
    await TrackPlayer.pause();
  };

  const playNextSong = async () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    await playSong(songs[nextIndex]);
  };

  const playPreviousSong = async () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    await playSong(songs[prevIndex]);
  };

  const seekTo = async (percent: number) => {
    const seekTime = (percent / 100) * duration;
    await TrackPlayer.seekTo(seekTime);
    setProgress(percent);
    setCurrentTime(seekTime);
  };

  const toggleLike = (songId: number) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, liked: !song.liked } : song
      )
    );
  };

  // Update progress every second
  useEffect(() => {
    const interval = setInterval(async () => {
      const position = await TrackPlayer.getPosition();
      const total = await TrackPlayer.getDuration();
      setCurrentTime(position);
      setDuration(total);
      setProgress((position / (total || 1)) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        progress,
        volume,
        duration,
        currentTime,
        playSong,
        pauseSong,
        playNextSong,
        playPreviousSong,
        seekTo,
        setVolume,
        toggleLike,
        formatTime,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
