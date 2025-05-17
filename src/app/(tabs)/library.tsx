
import SongCard from '@/src/components/SongCard';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { motion } from 'framer-motion';
import { Heart, Library, Search } from 'lucide-react';
import { useState } from 'react';

const LibraryPage = () => {
  const { songs } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter songs based on search query and active tab
  const filteredSongs = songs.filter(song => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'liked') {
      return matchesSearch && song.liked;
    }
    
    return matchesSearch;
  });
  
  return (
    <div className="px-4 py-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Library className="mr-2" /> Your Library
        </h1>
      </motion.div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          className="w-full bg-secondary/50 border-border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-border">
        <button
          className={`pb-2 px-1 relative ${activeTab === 'all' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('all')}
        >
          All Songs
          {activeTab === 'all' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="tabIndicator"
            />
          )}
        </button>
        <button
          className={`pb-2 px-1 relative flex items-center ${activeTab === 'liked' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('liked')}
        >
          <Heart className="mr-1" size={16} /> Favorites
          {activeTab === 'liked' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="tabIndicator"
            />
          )}
        </button>
      </div>
      
      {/* Song List */}
      <div className="space-y-1">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))
        ) : (
          <motion.div 
            className="text-center py-10 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No songs found</p>
            {searchQuery && (
              <p className="text-sm mt-2">
                Try adjusting your search or filters
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
