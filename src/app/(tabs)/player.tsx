
import AlbumVisualizer from '@/src/components/AlbumVisualizer';
import { Button } from '@/src/components/ui/button';
import { Slider } from '@/src/components/ui/slider';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { cn } from '@/src/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlayerPage = () => {
  const navigate = useNavigate();
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
    formatTime
  } = useMusicContext();

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No song selected</h2>
        <p className="text-muted-foreground mb-6">Select a song from your library to start playing</p>
        <Button onClick={() => navigate('/library')}>
          Go to Library
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen music-gradient px-4 py-6 pb-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -left-20 top-40 w-40 h-40 rounded-full bg-purple-400 opacity-20 blur-xl"></div>
      <div className="absolute right-10 bottom-40 w-60 h-60 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronDown size={24} />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-medium">Now Playing</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white"
          onClick={() => toggleLike(currentSong.id)}
        >
          <Heart 
            size={24} 
            className={cn(currentSong.liked && "fill-red-500 text-red-500")} 
          />
        </Button>
      </div>
      
      {/* Album Cover */}
      <motion.div 
        className="w-64 h-64 mx-auto rounded-lg overflow-hidden shadow-xl album-shadow mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className={cn(
          "w-full h-full rounded-lg overflow-hidden",
          isPlaying && "album-rotate"
        )}>
          <img  alt={`${currentSong.album} album cover`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1573247352896-dd8ee4f547ce" />
        </div>
      </motion.div>
      
      {/* Song Info */}
      <div className="text-center mb-8">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={`title-${currentSong.id}`}
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentSong.title}
          </motion.h2>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={`artist-${currentSong.id}`}
            className="text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {currentSong.artist}
          </motion.p>
        </AnimatePresence>
      </div>
      
      {/* Audio Visualizer */}
      <AlbumVisualizer isPlaying={isPlaying} />
      
      {/* Progress Bar */}
      <div className="mb-2 mt-6">
        <Slider 
          value={[progress]} 
          max={100} 
          step={0.1}
          onValueChange={(value) => seekTo(value[0])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center items-center space-x-6 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white/80 hover:bg-white/10"
        >
          <Shuffle size={20} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white/80 hover:bg-white/10"
          onClick={playPreviousSong}
        >
          <SkipBack size={24} />
        </Button>
        
        <Button 
          className="w-16 h-16 rounded-full bg-white text-purple-900 hover:bg-white/90 player-controls"
          onClick={() => playSong(currentSong)}
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white/80 hover:bg-white/10"
          onClick={playNextSong}
        >
          <SkipForward size={24} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white/80 hover:bg-white/10"
        >
          <Repeat size={20} />
        </Button>
      </div>
      
      {/* Volume Control */}
      <div className="flex items-center space-x-4 px-4">
        <Volume2 size={20} className="text-white/80" />
        <Slider 
          value={[volume]} 
          max={100} 
          step={1}
          onValueChange={(value) => setVolume(value[0])}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
