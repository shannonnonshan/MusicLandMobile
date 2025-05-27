import { baseURL } from '@/axios/platform.api';
import { getPlaylists } from '@/axios/playlist';
import { Playlist } from '@/contexts/MusicContext';
// import { useDeviceId } from '@/hooks/useDeviceId';
import { useDeviceId } from '@/contexts/DeviceContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';

import Animated, { SlideInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateScreen from './(modal)/create'; // chỉnh đường dẫn đúng

export default function ListPlaylistView() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  const { deviceId, loading } = useDeviceId();
  useEffect(() => {
      // console.log('deviceId:', deviceId);
    }, [deviceId]);

  // Hàm load playlist, có thể gọi lại khi cần reload
  const loadPlaylists = async () => {
    try {
      if (loading) return null;
      const data = await getPlaylists(deviceId);
      setPlaylists(data);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };
  
  
  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Header */}
      <View style={{ height: 66, paddingBottom: 8, position: 'relative', marginBottom: 12, justifyContent: 'center' }}>
            <Pressable
              onPress={() => router.back()}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: 4,
                  borderRadius: 8,
                }}
              >
              <Entypo name="chevron-small-left" size={25} color="white" />
            </Pressable>
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center', transform: [{ translateY: -10 }] }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Your Playlist</Text>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: [{ translateY: -10 }],
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Entypo name="add-to-list" size={20} color="white" />
        </Pressable>
      </View>

      {/* Playlist List */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 80, minHeight: screenHeight }}
      >
        {playlists.map((playlist, index) => (
          <Animated.View
            key={playlist._id}
            entering={SlideInLeft.delay(300 + index * 100)}
            style={{
              backgroundColor: '#555',
              elevation: 4,
              height: 70,
              borderRadius: 12,
              marginBottom: 12,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: `${baseURL.replace('/api', '')}${playlist.coverImage}` }}
              style={{ width: 45, height: 45, borderRadius: 12, marginRight: 12 }}
            />

            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{playlist.name}</Text>
              <Text style={{ color: '#F0F0F0', fontSize: 12 }}>{playlist.countSong} song{playlist.countSong !== 1 ? 's' : ''}</Text>
            </View>

            <Pressable
              onPress={() => router.push({
                pathname: '/playlist/library',
                params: { playlistId: playlist._id.toString() },
              })}
              style={({ pressed }) => ({
                padding: 8,
                borderRadius: 8,
                backgroundColor: pressed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              })}
            >
              <Entypo name="controller-play" size={18} color="white" />
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Modal Popup Create Playlist */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)', // background mờ
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 400,
              maxHeight: '80%',
              backgroundColor: '#121212',
              borderRadius: 16,
              overflow: 'hidden',
              elevation: 20,
            }}
          >
            <CreateScreen
              onClose={() => setModalVisible(false)}
              onCreated={() => {
                loadPlaylists();
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
