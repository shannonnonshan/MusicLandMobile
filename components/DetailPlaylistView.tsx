// components/DetailPlaylistView.tsx

import SongCard from '@/components/SongCard';
import { Playlist, Song, useMusicContext } from '@/contexts/MusicContext';

import { Heart, Search } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  songs: Song[];
  playlist?: Playlist;
}

export default function DetailPlaylistView({ songs, playlist }: Props) {
  const { playSong } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');

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
    <View className="flex-1 bg-gray-50 px-4 py-6 pb-20">
      {/* Header */}
      <View className="items-center mb-6">
        {playlist?.coverImage && (
          <Image
            source={{ uri: playlist.coverImage }}
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />
        )}
        <Text className="text-2xl font-bold text-gray-900 mt-4">{playlist?.name || 'Playlist'}</Text>
        <Text className="text-gray-500 text-sm mt-1">
          {playlist?.countSongs || 0} songs
        </Text>
      </View>

      {/* Search Bar */}
      <View className="relative mb-6">
        <Search
          size={18}
          color="#9CA3AF"
          style={{ position: 'absolute', left: 12, top: '50%', marginTop: -9 }}
        />
        <TextInput
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-gray-200 border border-gray-300 rounded-full py-2 pl-10 pr-4 text-gray-900"
          placeholderTextColor="#6B7280"
        />
      </View>

      {/* Tabs */}
      <View className="flex-row space-x-4 mb-6 border-b border-gray-300">
        <TouchableOpacity
          className={`pb-2 px-1 ${
            activeTab === 'all' ? 'border-b-2 border-purple-600' : ''
          }`}
          onPress={() => setActiveTab('all')}
        >
          <Text className={activeTab === 'all' ? 'text-purple-600 font-medium' : 'text-gray-500 font-medium'}>
            All Songs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`pb-2 px-1 flex-row items-center ${
            activeTab === 'liked' ? 'border-b-2 border-purple-600' : ''
          }`}
          onPress={() => setActiveTab('liked')}
        >
          <Heart size={16} color={activeTab === 'liked' ? '#7C3AED' : '#6B7280'} className="mr-1" />
          <Text className={activeTab === 'liked' ? 'text-purple-600 font-medium' : 'text-gray-500 font-medium'}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Song List */}
      {filteredSongs.length > 0 ? (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <SongCard
              song={item}
              index={index}
              onPress={() => {
                playSong(item);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-1" />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="py-10 items-center">
          <Text className="text-gray-500 text-center text-base">No songs found</Text>
          {searchQuery.length > 0 && (
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Try adjusting your search or filters
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
