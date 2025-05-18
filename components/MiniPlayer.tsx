
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
interface MiniPlayerProps {
  bottomOffset?: number;
  bgColor?: string;
}
export function MiniPlayer({ bottomOffset = 98, bgColor = '#F57D1F' }: MiniPlayerProps) {
  const router = useRouter();
  const currentSong = {
    title: 'Lạc Trôi',
    artist: 'Sơn Tùng M-TP',
    thumbnail: require('../assets/images/MSlogo.png'),
  };
  return (
    <TouchableOpacity
      onPress={() => router.push('/music/now-playing')}
      // onPress={() => router.push('/player')}
    //   activeOpacity={0.7}
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
        source={currentSong.thumbnail}
        className="w-12 h-12 rounded-md mr-4"
      />
      <View className="flex-1">
        <Text className="text-white font-semibold" numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text className="text-gray-500 text-md" numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>
      <Entypo name="controller-play" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
