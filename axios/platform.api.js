import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api' // Android emulator dùng 10.0.2.2
    : 'http://localhost:5000/api'; // iOS simulator hoặc web

// export const fetchSongs = async () => {
//   const res = await axios.get(`${baseURL}/songs`);
//   return res.data;
// };
