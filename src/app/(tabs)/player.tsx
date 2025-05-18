import AlbumVisualizer from '@/src/components/AlbumVisualizer';
import { Slider } from '@/src/components/ui/slider';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { useRouter } from 'expo-router'; // thay useNavigation thành useRouter
import {
  ChevronDown,
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
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
    <View className="flex-1 bg-gradient-to-b from-purple-900 via-indigo-900 to-black px-4 py-6 pb-20 relative">
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
          onPress={() => toggleLike(currentSong.id)}
        >
          <Heart
            size={24}
            color={currentSong.liked ? 'red' : 'white'}
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
      <View className="flex-row justify-center items-center space-x-6 mb-8">
        <TouchableOpacity>
          <Shuffle size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPreviousSong}>
          <SkipBack size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-white justify-center items-center"
          onPress={() => playSong(currentSong)}
        >
          {isPlaying ? <Pause size={30} color="#6b21a8" /> : <Play size={30} color="#6b21a8" />}
        </TouchableOpacity>

        <TouchableOpacity onPress={playNextSong}>
          <SkipForward size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Repeat size={20} color="white" />
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
          onValueChange={(value) => setVolume(value)}
          minimumTrackTintColor="#7c3aed"
          maximumTrackTintColor="#fff"
          thumbTintColor="#a78bfa"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default PlayerPage;
