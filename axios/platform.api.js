import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let baseURL = 'https://musicland-fhhi.onrender.com/api'; // Default for web

if (Platform.OS === 'android') {
  // Android emulator đặc biệt: dùng 10.0.2.2 để trỏ về localhost máy thật
  // baseURL = 'http://10.0.2.2:5000/api';
  // baseURL = 'http://192.168.1.6:5000/api';
  baseURL = 'https://musicland-fhhi.onrender.com/api'
} else if (Platform.OS !== 'web') {
  const debuggerHost = Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;
  console.log('Debugger host:', debuggerHost);
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    baseURL = `http://${ip}:5000/api`;
  } 
}else if (Platform.OS === 'ios') {
  const debuggerHost = Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    baseURL = `http://${ip}:5000/api`;
  } else {
    baseURL = 'http://192.168.1.13:5000/api'; // fallback nếu không lấy được host
  }
}
  
console.log('Base URL:', baseURL);
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});
export { baseURL };
export default axiosInstance;
