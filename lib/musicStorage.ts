// lib/musicStorage.ts
import { Song } from '@/contexts/MusicContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Định nghĩa interface Song cho đúng kiểu
// export interface Song {
//   id: number;
//   title: string;
//   artist: string;
//   album: string;
//   duration: number;
//   liked: boolean;
//   thumbnail?: string; 
// }

export const initialSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Starlight",
    duration: 237,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "2",
    title: "Electric Waves",
    artist: "Neon Pulse",
    album: "Synthwave",
    duration: 198,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "3",
    title: "Ocean Breeze",
    artist: "Coastal Vibes",
    album: "Summer Days",
    duration: 224,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "City Sounds",
    album: "Metropolis",
    duration: 185,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "5",
    title: "Mountain High",
    artist: "Alpine Echoes",
    album: "Nature's Call",
    duration: 246,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "6",
    title: "Sunset Boulevard",
    artist: "Golden Hour",
    album: "Dusk to Dawn",
    duration: 213,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id:" 7",
    title: "Rainy Day",
    artist: "Ambient Moods",
    album: "Weather Patterns",
    duration: 274,
    liked: true,
    thumbnail : '../assets/images/MSlogo.png'
  },
  {
    id: "8",
    title: "Neon Lights",
    artist: "City Glow",
    album: "After Hours",
    duration: 192,
    liked: false,
    thumbnail : '../assets/images/MSlogo.png'
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
