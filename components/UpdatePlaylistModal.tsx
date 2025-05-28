import { updatePlaylist } from '@/axios/playlist';
import { useDeviceId } from '@/contexts/DeviceContext';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    StatusBar as RNStatusBar,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';


interface Props {
  visible: boolean;
  playlistId?: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function UpdatePlaylistModal({
  visible,
  playlistId,
  onClose,
  onUpdated,
}: Props) {
  if (!visible) return null; // Không render nếu không hiển thị

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const { deviceId, loading } = useDeviceId();

  useEffect(() => {
    console.log('deviceId:', deviceId);
  }, [deviceId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300, height: 200 } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setImage(manipulated.uri);
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a playlist name.');
      return;
    }

    if (loading) return;

    if (!playlistId) {
      Alert.alert('Playlist ID not available.');
      return;
    }

    try {
      const result = await updatePlaylist({
        name,
        playlistId,
        imageUri: image ?? undefined,
      });

      console.log('Playlist updated:', result);

      onUpdated(); // Reload danh sách
      onClose();   // Đóng modal
    } catch (err: any) {
      console.error('Failed to update playlist:', err.message);
      Alert.alert('Error', 'Could not update playlist.');
    }
  };

  return (
    <Modal
      visible={visible} animationType="slide" transparent>
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
                <View style={styles.modalContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Update Playlist</Text>
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
        <TouchableOpacity onPress={handleUpdatePlaylist} style={styles.button}>
          <Text style={styles.buttonText}>Update Playlist</Text>
        </TouchableOpacity>
      </Animated.View>
                </View>
        </View>
    </ScrollView>
    </Modal>
  );
}
;


const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
    modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 16,
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
