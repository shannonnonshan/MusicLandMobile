
import { Button } from '@/src/components/ui/button';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { motion } from 'framer-motion';
import { Disc, Headphones, Music, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { songs, playSong } = useMusicContext();
  
  // Get recently played songs (for this demo, just the first 4)
  const recentSongs = songs.slice(0, 4);
  
  // Get featured playlists (in a real app, these would be actual playlists)
  const featuredPlaylists = [
    { id: 1, name: "Top Hits", songCount: 20, color: "from-purple-600 to-blue-500" },
    { id: 2, name: "Chill Vibes", songCount: 15, color: "from-green-500 to-teal-400" },
    { id: 3, name: "Workout Mix", songCount: 18, color: "from-red-500 to-orange-400" },
  ];

  return (
    <div className="px-4 py-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Headphones className="mr-2" /> Melodify
        </h1>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        className="rounded-xl p-6 mb-8 music-gradient relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Discover New Music</h2>
          <p className="text-sm opacity-80 mb-4">Listen to the latest hits and your favorite artists</p>
          <Button 
            onClick={() => navigate('/library')}
            className="bg-white text-purple-900 hover:bg-white/90"
          >
            <Play className="mr-2 h-4 w-4" /> Start Listening
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-400 opacity-20 blur-xl"></div>
        <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
      </motion.div>

      {/* Recently Played */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Disc className="mr-2 h-5 w-5" /> Recently Played
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {recentSongs.map((song, index) => (
            <motion.div
              key={song.id}
              className="bg-card rounded-lg p-3 hover:bg-secondary/80 transition-colors cursor-pointer"
              onClick={() => playSong(song)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full aspect-square rounded-md overflow-hidden mb-2">
                <img  alt={`${song.album} album cover`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1668791871017-989a35d2e0cf" />
              </div>
              <h3 className="font-medium text-sm truncate">{song.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Music className="mr-2 h-5 w-5" /> Featured Playlists
        </h2>
        
        <div className="space-y-3">
          {featuredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              className={`bg-gradient-to-r ${playlist.color} rounded-lg p-4 flex justify-between items-center`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <h3 className="font-bold">{playlist.name}</h3>
                <p className="text-sm opacity-80">{playlist.songCount} songs</p>
              </div>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                <Play className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
