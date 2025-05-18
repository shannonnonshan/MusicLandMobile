
import type { Song } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';


interface MiniPlayerProps {
  bottomOffset?: number;
  bgColor?: string;
  song?: Song;
}
export function MiniPlayer({ bottomOffset = 98, bgColor = '#F57D1F',song}: MiniPlayerProps) {
  const router = useRouter();
  const title = song?.title || 'Lạc Trôi';
  const artist = song?.artist || 'Sơn Tùng M-TP';
  const thumbnail =
    song?.thumbnail || require('../assets/images/MSlogo.png')
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
      <Image
        source={thumbnail}
        className="w-12 h-12 rounded-md mr-4"
      />
      <View className="flex-1">
        <Text className="text-white font-semibold" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-gray-500 text-md" numberOfLines={1}>
          {artist}
        </Text>
      </View>
      <Entypo name="controller-play" size={28} color="#fff" />
    </TouchableOpacity>
  );
}