import axios from 'axios';
import { Platform } from 'react-native';


export const baseURL =
  Platform.OS === 'android'
    ? 'http://192.168.1.6:5000/api' // Android Emulator
    : 'http://localhost:5000/api' // iOS Simulator


const axiosInstance = axios.create({
  baseURL,
});
export default axiosInstance;
