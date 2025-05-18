import axios from 'axios';
import qs from 'qs'; // hoặc URLSearchParams nếu không có 'qs'

const client_id = '28f9fa1c72e2461bbfce68c4e6728f58';
const client_secret = '0cec1f95f55f4e3faf80f6375cad3b9b';

export async function getAccessToken() {
  const token_url = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({ grant_type: 'client_credentials' });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      'Basic ' + btoa(client_id + ':' + client_secret), // Base64 encode
  };

  const res = await axios.post(token_url, data, { headers });
  return res.data.access_token;
}
export async function searchTracks(query) {
  const token = await getAccessToken();

  const res = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=2`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // danh sách bài hát
}