import * as SecureStore from 'expo-secure-store';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

const DEVICE_ID_KEY = 'my_device_unique_id';

interface DeviceIdContextType {
  deviceId: string | null;
  loading: boolean;
}

const DeviceIdContext = createContext<DeviceIdContextType | undefined>(undefined);

const generateSimpleId = (): string =>
  Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

interface DeviceIdProviderProps {
  children: ReactNode;
}

export const DeviceIdProvider: React.FC<DeviceIdProviderProps> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        setLoading(false);
      }
    };

    loadDeviceId();
  }, []);

  return (
    <DeviceIdContext.Provider value={{ deviceId, loading }}>
      {children}
    </DeviceIdContext.Provider>
  );
};

export const useDeviceId = (): DeviceIdContextType => {
  const context = useContext(DeviceIdContext);
  if (context === undefined) {
    throw new Error('useDeviceId must be used within a DeviceIdProvider');
  }
  return context;
};
