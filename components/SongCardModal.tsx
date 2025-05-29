import { deleteSongInPlaylist } from '@/axios/playlist';
import { useDeviceId } from '@/contexts/DeviceContext';
import type { Song } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons'; // 👈 dùng cho icon "cancel"
import { useRouter } from 'expo-router';
import {
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
interface Props {
  visible: boolean;
  song: Song;
  playlistId?: string;
  onClose: () => void;
  onAction: () => void;
}

export default function SongCardModal({ visible, song, playlistId, onClose,onAction}: Props) {
  const router = useRouter();
const deviceId = useDeviceId();
  const handleDeleteSong = async () => {
    try {
    if (!song) return;
    await deleteSongInPlaylist(playlistId, song.id);
    console.log('Song deleted successfully');
    onAction()
    onClose();
    } catch (error: any) {
    console.error('Delete song failed:', error.message);
    }
};
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Entypo name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={styles.headerTitle}>{song.title}</Text>
            <Text className='text-[#bbb]'>{song.artist}</Text>
            </View>
          </View>
         <View style={{ marginTop: 30 }}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                    router.push({
                        pathname: '/playlist/list-playlist',
                        params: {
                        isPlayer: 'true', // nên là chuỗi nếu dùng trong URL
                         deviceId: deviceId.deviceId ,
                        song: JSON.stringify(song), // truyền ID bài hát hiện tại
                        },
                    });
                    }}
                >
                    <Text style={styles.optionText}>Add to your playlist</Text>
                </TouchableOpacity>

                {playlistId && (
                    <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleDeleteSong}
                    >
                    <Text style={[styles.optionText]}>Delete this song in this playlist</Text>
                    </TouchableOpacity>
                )}
                </View>   
        </View>
      </View>
    </Modal>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
//   modalContainer: {
//     flex: 0.9,
//     backgroundColor: '#000',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: '50%',
//     paddingHorizontal: 16,
//   },
    modalContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',         // 👈 giới hạn chiều cao tối đa
    paddingVertical: 24,      // 👈 padding đều phía trên/dưới cho nội dung
    paddingHorizontal: 16,
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 110
  },
  cancelButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  input: {
    color: 'white',
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    marginTop: 10,
  },
  count: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10
  },
  selected: {
    borderColor: '#4ade80',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  optionButton: {
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
},
optionText: {
  color: '#fff',
  fontSize: 16,
},

});
