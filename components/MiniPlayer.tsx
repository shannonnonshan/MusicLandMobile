import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MiniPlayerProps {
  bottomOffset?: number;
  bgColor?: string;
}

export function MiniPlayer({
  bottomOffset = 85,
  bgColor = '#F57D1F',
}: MiniPlayerProps) {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNextSong,
  } = useMusicContext();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push('/player')}
      activeOpacity={0.9}
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: bgColor,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 2,
      }}
    >
      {/* Thumbnail + Info */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={
            currentSong.thumbnail?.startsWith('http')
              ? { uri: currentSong.thumbnail }
              : require('../assets/images/MSlogo.png')
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            marginRight: 12,
            backgroundColor: '#eee',
          }}
        />
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}
            numberOfLines={1}
          >
            {currentSong.title}
          </Text>
          <Text style={{ color: '#ccc', fontSize: 12 }} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
      </View>

      {/* Nút Play / Pause */}
      <TouchableOpacity onPress={togglePlayPause} style={{ paddingHorizontal: 8 }}>
        <Entypo
          name={isPlaying ? 'controller-paus' : 'controller-play'}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Nút Next */}
      <TouchableOpacity onPress={playNextSong}>
        <Entypo name="controller-next" size={28} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
