import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'unique_device_id';

export const getOrCreateDeviceId = async () => {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const fallbackId = Device.osInternalBuildId || uuidv4();
  await AsyncStorage.setItem(DEVICE_ID_KEY, fallbackId);
  return fallbackId;
};
