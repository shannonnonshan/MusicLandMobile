import { createPlaylist } from '@/axios/playlist';
// import { useDeviceId } from '@/hooks/useDeviceId';
import { useDeviceId } from '@/contexts/DeviceContext';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';


const CreateScreen = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const { deviceId, loading } = useDeviceId();

  useEffect(() => {
    console.log('deviceId:', deviceId);
    
  }, [deviceId]);

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // tắt editing của ImagePicker
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];

    const manipulated = await ImageManipulator.manipulateAsync(
      asset.uri,
      [
        { resize: { width: 300, height: 200 } },
      ],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    setImage(manipulated.uri); // cập nhật URI đã xử lý
  }
};

  const handleCreatePlaylist = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a playlist name.');
      return;
    }
    if (loading) return null;
    if (!deviceId) {
      Alert.alert('Device ID not available.');
      return;
    }

    try {
      const result = await createPlaylist({
        name,
        deviceId,
        imageUri: image ?? undefined,
      });

      console.log('Playlist created:', result);

      onCreated();  // Reload danh sách playlist
      onClose();    // Đóng modal
    } catch (err: any) {
      console.error('Failed to create playlist:', err.message);
      Alert.alert('Error', 'Could not create playlist.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Playlist</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
        <Text style={styles.label}>Playlist Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Choose an image</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Text style={styles.label}>Playlist Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter playlist name"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600)} style={{ marginTop: 24 }}>
        <TouchableOpacity onPress={handleCreatePlaylist} style={styles.button}>
          <Text style={styles.buttonText}>Create Playlist</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    color: 'white',
  },
  imagePicker: {
    backgroundColor: '#1E1E1E',
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
