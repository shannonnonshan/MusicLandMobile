import { baseURL } from '@/axios/platform.api';
import { addSongToPlaylist } from '@/axios/playlist';
import { Playlist, Song, useMusicContext } from '@/contexts/MusicContext';
import { useRouter } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
interface Props {
  playlist: Playlist;
  index: number;
  song?: Song;
}

const PlayerAddSongCard: React.FC<Props> = ({playlist , index, song}) => {
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false); 
    let currentSong;
    if(song){
     currentSong = song;
    }
    else{
     const { currentSong: current } = useMusicContext();
        currentSong = current;
    }

    const handleAddSong = async () => {
        try {
        if (!currentSong) return;
        await addSongToPlaylist(playlist._id, currentSong.id);
        setIsAdded(true);
        } catch (error) {
        console.error('Add song failed:', error);
        }
    };
  return (
    <Pressable
          key={playlist._id}
        
            onPress={() => router.push({
                        pathname: '/playlist/library',
                        params: { playlistId: playlist._id.toString() },
                    })}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            borderRadius: 12,
          })}
        >
          <Animated.View
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
              <Text style={{ color: '#F0F0F0', fontSize: 12 }}>
                {playlist.countSong} song{playlist.countSong !== 1 ? 's' : ''}
              </Text>
            </View>

            <Pressable
                onPress={handleAddSong}
                style={({ pressed }) => ({
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: pressed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                })}
            >
              {isAdded ? (
                <Check size={30} color="#F72798" /> 
                ) : (
                    <Plus size={30} color="#EBF400" /> 
                )}
            </Pressable>
          </Animated.View>
        </Pressable>
  )
};
export default PlayerAddSongCard;
