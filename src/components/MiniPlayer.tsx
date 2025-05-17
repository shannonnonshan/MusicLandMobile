import { useMusicContext } from '@/contexts/MusicContext';
import { Button } from '@/src/com@/src/contexts/MusicContext
import { motion } from 'framer-motion';
import { Pause, Play, SkipForward } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, playNextSong, progress } = useMusicContext();

  if (!currentSong) return null;

  return (
    <motion.div 
      className="fixed bottom-16 left-0 right-0 bg-card border-t border-border glass-effect z-10 px-4 py-3"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate('/player')}
        >
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
            <img
              alt={`${currentSong.album} album cover`}
              className="w-full h-full object-cover"
              src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1664724195484-826ea9ee26a3'}
            />
          </div>
          <div className="truncate">
            <h4 className="font-medium truncate">{currentSong.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              playSong(currentSong);
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              playNextSong();
            }}
          >
            <SkipForward size={18} />
          </Button>
        </div>
      </div>
      
      {/* Animated progress bar */}
      <div className="h-1 w-full bg-secondary/30 rounded overflow-hidden mt-2">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default React.memo(MiniPlayer);
