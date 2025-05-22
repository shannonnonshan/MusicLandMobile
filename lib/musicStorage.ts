// lib/musicStorage.ts
import { Song } from '@/contexts/MusicContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Starlight",
    duration: 237,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/midnight-dreams.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "2",
    title: "Electric Waves",
    artist: "Neon Pulse",
    album: "Synthwave",
    duration: 198,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/electric-waves.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "3",
    title: "Ocean Breeze",
    artist: "Coastal Vibes",
    album: "Summer Days",
    duration: 224,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/ocean-breeze.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "City Sounds",
    album: "Metropolis",
    duration: 185,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/urban-jungle.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "5",
    title: "Mountain High",
    artist: "Alpine Echoes",
    album: "Nature's Call",
    duration: 246,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/mountain-high.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "6",
    title: "Sunset Boulevard",
    artist: "Golden Hour",
    album: "Dusk to Dawn",
    duration: 213,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/sunset-boulevard.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id:" 7",
    title: "Rainy Day",
    artist: "Ambient Moods",
    album: "Weather Patterns",
    duration: 274,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/rainy-day.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  },
  {
    id: "8",
    title: "Neon Lights",
    artist: "City Glow",
    album: "After Hours",
    duration: 192,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png',
    uri: "https://www.example.com/audio/neon-lights.mp3",
    gerne: "Pop",
    releaseYear:"2020",
  }
];

const STORAGE_KEY = 'musicPlayerSongs';

export const loadSongsFromStorage = async (): Promise<Song[] | null> => {
  try {
    const savedSongs = await AsyncStorage.getItem(STORAGE_KEY);
    return savedSongs ? (JSON.parse(savedSongs) as Song[]) : null;
  } catch (error) {
    console.error("Failed to load songs from AsyncStorage", error);
    return null;
  }
};

export const saveSongsToStorage = async (songs: Song[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (error) {
    console.error("Failed to save songs to AsyncStorage", error);
  }
};
