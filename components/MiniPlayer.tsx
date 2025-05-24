
import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';


interface MiniPlayerProps {
  bottomOffset?: number;
  bgColor?: string;
}

export function MiniPlayer({ bottomOffset = 85, bgColor = '#F57D1F' }: MiniPlayerProps) {
  const router = useRouter();
  const {currentSong} = useMusicContext();
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
        marginBottom: 0
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
         <Image
            source={{ uri: 'https://images.unsplash.com/photo-1664724195484-826ea9ee26a3' }}
            className="w-10 h-10 rounded-md mr-2"
          />
          <View>
             <Text style={{ color: 'white', fontWeight: '600', fontSize: 13  }} numberOfLines={1}>
              {currentSong?.title} 
            </Text>
            <Text style={{ color: '#ccc', fontSize: 13}} numberOfLines={1}>
              {currentSong?.artist}
            </Text>
          </View>
      </View>
      <Entypo name="controller-play" size={28} color="#fff" />
      <Entypo name="controller-next" size={28} color="#fff" />
    </TouchableOpacity>
  );
}