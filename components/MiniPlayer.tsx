import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MiniPlayerProps {
  bottomOffset?: number;
  bgColor?: string;
}

export function MiniPlayer({ bottomOffset = 98, bgColor = '#F57D1F' }: MiniPlayerProps) {
  const router = useRouter();
  const { currentSong } = useMusicContext();

  // Không hiển thị MiniPlayer nếu chưa có bài hát
  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push('/player')}
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
        borderRadius: 8,
        marginHorizontal: 2,
      }}
    >
      <View style={{ flex: 1 }}>
         <Image
            source={{ uri: 'https://images.unsplash.com/photo-1664724195484-826ea9ee26a3' }}
            className="w-10 h-10 rounded-md"
          />
        <Text style={{ color: 'white', fontWeight: '600' }} numberOfLines={1}>
          {currentSong.title} ||
        </Text>
        <Text style={{ color: '#ccc' }} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>
      <Entypo name="controller-play" size={28} color="#fff" />
    </TouchableOpacity>
  );
}