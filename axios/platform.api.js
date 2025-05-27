import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let baseURL = 'http://localhost:5000/api'; // Default for web

if (Platform.OS === 'android') {
  // Android emulator đặc biệt: dùng 10.0.2.2 để trỏ về localhost máy thật
  baseURL = 'http://10.0.2.2:5000/api';
} else if (Platform.OS !== 'web') {
  const debuggerHost =
    Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    baseURL = `http://${ip}:5000/api`;
  } 
}

console.log('baseURL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});
export { baseURL };
export default axiosInstance;
