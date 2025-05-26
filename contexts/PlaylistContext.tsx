import { Song } from './MusicContext';
export interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  songs: Song[];
}

