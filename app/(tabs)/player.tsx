import AlbumVisualizer from '@/components/AlbumVisualizer';
import { Slider } from '@/components/ui/slider';
import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Heart,
  MicVocal,
  Volume2
} from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const PlayerPage = () => {
  const router = useRouter();  // Dùng router từ expo-router
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    playSong,
    playNextSong,
    playPreviousSong,
    seekTo,
    setVolume,
    toggleLike,
    formatTime,
  } = useMusicContext();

  console.log(currentSong);
  if (!currentSong) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-black">
        <Text className="text-white text-2xl font-bold mb-4">No song selected</Text>
        <Text className="text-gray-400 mb-6 text-center">
          Select a song from your library to start playing
        </Text>
        <TouchableOpacity
          className="bg-purple-700 px-4 py-2 rounded"
          onPress={() => router.push('/library')}  // dùng router.push thay navigate
        >
          <Text className="text-white text-center">Go to Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black from-purple-900 via-indigo-900 to-black px-4 py-6 pb-20 relative">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          className="p-2"
          onPress={() => router.back()}  // dùng router.back() thay navigation.goBack()
        >
          <ChevronDown size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-lg font-medium">Now Playing</Text>
        </View>
        <TouchableOpacity
          className="p-2"
          onPress={() => toggleLike(Number(currentSong.id))}
        >
          <Heart
            size={24}
            color={currentSong.liked ? 'red' : '#999'}
            fill={currentSong.liked ? 'red' : 'none'}
          />
        </TouchableOpacity>
      </View>

      {/* Album Cover */}
      <View className="w-64 h-64 mx-auto rounded-lg overflow-hidden shadow-lg mb-8">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1573247352896-dd8ee4f547ce' }}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
        />
      </View>

      {/* Song Info */}
      <View className="items-center mb-8">
        <Text className="text-white text-2xl font-bold mb-2">{currentSong.title}</Text>
        <Text className="text-white opacity-70 text-lg">{currentSong.artist}</Text>
      </View>

      {/* Album Visualizer */}
      <AlbumVisualizer isPlaying={isPlaying} />

      {/* Progress Bar */}
      <View className="mb-2 mt-6">
        <Slider
          value={progress}
          maximumValue={100}
          minimumValue={0}
          step={0.1}
          onValueChange={(value) => seekTo(value)}
          minimumTrackTintColor="#7c3aed"
          maximumTrackTintColor="#fff"
          thumbTintColor="#a78bfa"
        />
        <View className="flex-row justify-between">
          <Text className="text-white opacity-70 text-sm">{formatTime(currentTime)}</Text>
          <Text className="text-white opacity-70 text-sm">{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row justify-center items-center gap-5 space-x-10 mb-8">
        <TouchableOpacity>
          <Entypo name="shuffle" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPreviousSong}>
          <Entypo name="controller-jump-to-start" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => playSong(currentSong)}
        >
          <Entypo
            name={isPlaying ? 'controller-paus' : 'controller-play'}
            size={30}
            color="#6b21a8"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="controller-next" size={24} color="white" onPress={playNextSong}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo Repeat name="ccw" size={20} color="white"/>r
        </TouchableOpacity>

      </View>

      {/* Volume Control */}
      <View className="flex-row items-center space-x-4 px-4">
        <Volume2 size={20} color="rgba(255,255,255,0.8)" />
        <Slider
          value={volume}
          maximumValue={100}
          minimumValue={0}
          step={1}
          onSlidingComplete={(value) => setVolume(value)}
          minimumTrackTintColor="#7c3aed"
          maximumTrackTintColor="#fff"
          thumbTintColor="#a78bfa"
          style={{ flex: 1 }}
        />
        <MicVocal onPress={() => router.push(`/music/detail-music?${currentSong.id}`)} size={20} color="rgba(255,255,255,0.8)"/>
      </View>
    </View>
  );
};

export default PlayerPage;
