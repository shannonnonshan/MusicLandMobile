import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const DEVICE_ID_KEY = 'my_device_unique_id';

// Hàm tạo ID đơn giản (chuỗi ngẫu nhiên + timestamp)
const generateSimpleId = () => {
  return (
    Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  );
};

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const loadDeviceId = async () => {
      try {
        let existingId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
        if (!existingId) {
          const newId = generateSimpleId();
          await SecureStore.setItemAsync(DEVICE_ID_KEY, newId);
          existingId = newId;
        }
        setDeviceId(existingId);
      } catch (error) {
        console.error('Failed to load or set device ID:', error);
        setDeviceId(null);
      }
    };

    loadDeviceId();
  }, []);

  return deviceId;
};
