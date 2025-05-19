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
