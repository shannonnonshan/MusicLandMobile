import DetailPlaylistView from '@/components/DetailPlaylistView';
import { initialPlaylist } from '@/lib/playlistStorage';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const playlist = useMemo(() =>
    initialPlaylist.find(p => String(p.id) === String(id)),
    [id]
  );

  const playlistSongs = useMemo(() => playlist?.songs || [], [playlist]);

  return (
    <DetailPlaylistView songs={playlistSongs} playlist={playlist} />
  );
}
