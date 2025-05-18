import { MiniPlayer } from '@/components/MiniPlayer';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchTracks } from '../../axios/sporitfy.api';
import '../../global.css';
interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
}
export default function TabSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

  
  useEffect(() => {
  if (!searchQuery.trim()) {
    setTracks([]);
    return;
  }

  const delayDebounce = setTimeout(() => {
    searchTracks(searchQuery)
      .then((res) => {
        console.log('Raw Spotify response:', JSON.stringify(res, null, 2));
        if (Array.isArray(res?.tracks?.items)) {
          setTracks(res.tracks.items);
        } else {
          console.log('Invalid response:', res);
        }
      })
      .catch((err) => {
        console.error('Search error:', err);
      });
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cố định */}
      <View className="bg-[#000]">
        <View className="flex-row items-center justify-start px-4">
          <Image
            source={require('../../assets/images/MSlogo.png')}
            style={{ width: 60, height: 60 }}
          />
          <Text className="text-[#fff] text-2xl font-bold">Search</Text>
        </View>

        <View className="pt-2 w-full bg-[#000] px-4">
          <TextInput
            className="text-[#fff] bg-[#222] rounded-lg pr-3 py-2  pl-4 text-xl"
            placeholder="Search songs, artists, albums..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text className="text-[#fff] pt-2 pb-3 text-xl mt-5 z-10">
            Search result for: {searchQuery}
          </Text>
        </View>
      </View>

      {/* Kết quả tìm kiếm */}
      <ScrollView>
        {tracks.map((track) => (
          <MiniPlayer
            key={track.id}
            bottomOffset={0}
            bgColor="#222"
            title={track.name}
            artist={track.artists?.[0]?.name || 'Unknown Artist'}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: STATUS_BAR_HEIGHT + 10,
  },
});