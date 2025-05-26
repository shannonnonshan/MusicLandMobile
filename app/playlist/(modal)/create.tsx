import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePlaylist = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a playlist name.');
      return;
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      coverImage: image ?? 'https://placehold.co/300x300',
      colors: ['#7C3AED'],
    };

    router.replace({
      pathname: '/playlist/list-playlist',
      params: {
        created: JSON.stringify(newPlaylist),
      },
    });
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            <Text style={styles.label}>Playlist Image</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>Choose an image</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
            <Text style={styles.label}>Playlist Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter playlist name"
              placeholderTextColor="#ccc"
              style={styles.input}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 24 }}>
            <TouchableOpacity onPress={handleCreatePlaylist} style={styles.button}>
              <Text style={styles.buttonText}>Create Playlist</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CreateScreen;

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.9,
    backgroundColor: '#121212',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  container: {
    paddingBottom: 20,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#aaa',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
