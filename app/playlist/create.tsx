import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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

  // router.push(`/playlist/selectSong?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image ?? '')}`);
  router.push({
  pathname: '/playlist/selectSong' as any, // hoặc as any
  params: {
    name,
    description,
    image,
  },
});
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add a short description"
          placeholderTextColor="#ccc"
          style={[styles.input, { height: 100 }]}
          multiline
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
