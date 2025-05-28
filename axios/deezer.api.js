import axios from 'axios';

const deezerAPI = axios.create({
  baseURL: 'https://api.deezer.com',
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
});

export const searchTracks = async (query) => {
  try {
    const response = await deezerAPI.get('/search', {
      params: {
        q: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Deezer API error:', error);
    throw error;
  }
};

export const searchMulti = async (query) => {
  try {
    const [tracksRes, albumsRes] = await Promise.all([
      axios.get('https://api.deezer.com/search/track', { params: { q: query } }),
      axios.get('https://api.deezer.com/search/album', { params: { q: query } }),
    ]);

    return {
      tracks: tracksRes.data.data.slice(0, 16), // lấy 10 bài hát đầu
      albums: albumsRes.data.data.slice(0, 6),   // lấy 5 album đầu
    };
  } catch (error) {
    console.error('Multi search error:', error);
    throw error;
  }
};
export async function getTopCharts() {
  const url = 'https://api.deezer.com/chart';

  const response = await axios.get(url);

  const data = response.data;

  return {
    tracks: data.tracks.data.slice(0, 10), // lấy 10 bài hát đầu
    albums: data.albums.data.slice(0,5)
  };
};
export const fetchTop4Tracks = async () => {
  try {
    const url = 'https://api.deezer.com/chart/0/tracks?limit=4';
    const response = await axios.get(url);
    const data = response.data;
    return {tracks: data.data};
  } catch (err) {
    console.error('Lỗi fetch từ Deezer:', err);
    return [];
  }
};
export async function getAlbumTracks(albumId) {
  const res = await axios.get(`https://api.deezer.com/album/${albumId}`);
  const data = res.data;

  const songs = data.tracks.data.map((track) => ({
    id: track.id,
    title: track.title,
    artist: track.artist?.name || 'Unknown Artist',
    album: data.title || 'Unknown Album',
    duration: track.duration || 0,
    liked: false,
    thumbnail: data.cover_medium || '',
    uri: track.preview || ''
  }));

  return {
    albumThumbnail: data.cover_medium,
    albumTitle: data.title,
    songs
  };
}

export const searchTracksByIds = async (ids) => {
  try {
    const trackPromises = ids.map((id) =>
      axios.get(`https://api.deezer.com/track/${id}`)
    );

    const responses = await Promise.all(trackPromises);

    const tracks = responses.map((res) => {
      const track = res.data;
      return {
        id: track.id,
        title: track.title,
        artist: track.artist?.name || 'Unknown Artist',
        album: track.album?.title || 'Unknown Album',
        duration: track.duration || 0,
        liked: false,
        thumbnail: track.album?.cover_medium || '',
        uri: track.preview || ''
      };
      });

    return tracks;
  } catch (error) {
    console.error('Error fetching tracks by IDs:', error);
    throw error;
  }
};
export const extractTrackId = (url) => {
  const match = url.match(/track\/(\d+)/);
  return match ? match[1] : null;
};
export async function fetchLyricsFromDeezer(trackId, arlCookie) {
  const url = `https://www.deezer.com/ajax/gw-light.php?method=song.getLyrics&api_version=1.0&sng_id=${trackId}`;

  const res = await fetch(url, {
    headers: {
      Cookie: `arl=${arlCookie}`,
      'User-Agent': 'Mozilla/5.0 (compatible; DeezerAPI/1.0)',
      Accept: 'application/json',
    },
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to fetch lyrics');
  }

  return data.results && data.results.lyrics && data.results.lyrics.lyrics
    ? data.results.lyrics.lyrics
    : '[Không có lời bài hát]';
}

