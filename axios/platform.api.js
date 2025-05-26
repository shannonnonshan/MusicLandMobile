import axios from 'axios';
import { Platform } from 'react-native';


export const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api' // Android Emulator
    : 'http://localhost:5000/api' // iOS Simulator


const axiosInstance = axios.create({
  baseURL,
});
export default axiosInstance;
