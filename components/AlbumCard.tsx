import type { Album } from '@/contexts/MusicContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

type AlbumProps = {
  album: Album;
    onPress: () => void;
};

const AlbumCard: React.FC<AlbumProps> = ({ album, onPress }) => {
    const router = useRouter();
  return (
    <TouchableOpacity
    onPress={() => router.push({
        pathname: '/music/albumLoader',
        params: { albumId: album.id.toString() },
        })}
      style={{
              width: '15%',
              backgroundColor: '#1F2937',
              borderRadius: 12,
              padding: 10,
              marginRight: 16,
            }}
      activeOpacity={0.8}
    >
      <Image
        source={{uri: album.thumbnail }}
        style={{
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 8,
        }}
    />
    <Text style={{ fontWeight: '500', color: 'white' }} numberOfLines={1}>
        {album.title}
    </Text>
    <Text style={{ fontSize: 12, color: '#9CA3AF' }} numberOfLines={1}>
        {album.artist}
            </Text>
    </TouchableOpacity>
  );
};


export default AlbumCard;
