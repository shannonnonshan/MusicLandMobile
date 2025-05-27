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
    tracks: data.tracks.data,
    albums: data.albums.data
  };
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