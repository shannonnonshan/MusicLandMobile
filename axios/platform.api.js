import axios from 'axios';
import { Platform } from 'react-native';


export const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api' // Android Emulator
    : 'http://localhost:5000/api' // iOS Simulator

export const createPlaylist = async (playlistData) => {
  const deviceId = await getOrCreateDeviceId();

  const res = await axios.post(`${baseURL}/playlist`, {
    ...playlistData,
    deviceId,
  });

  return res.data;
};

// ✅ Ví dụ lấy playlist theo deviceId
export const fetchPlaylistsByDevice = async () => {
  const deviceId = await getOrCreateDeviceId();

  const res = await axios.get(`${baseURL}/playlist/device/${deviceId}`);
  return res.data;
};

export const fetchPlaylists = async () => {
  const res = await axios.get(`${baseURL}/playlist`);
  return res.data;
};
