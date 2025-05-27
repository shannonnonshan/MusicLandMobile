import * as FileSystem from 'expo-file-system';
import axiosInstance from './platform.api';
export const fetchPlaylists = async () => {
  const res = await axiosInstance.get('/playlist');
  return res.data;
};

export const createPlaylist = async ({ name, deviceId, imageUri }) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('deviceId', deviceId);

  if (imageUri) {
    const fileName = imageUri.split('/').pop() || 'image.jpg';
    const fileType = fileName.split('.').pop();

    // Đọc file base64 để debug nếu cần
    // const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

    formData.append('image', {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,
    });
  }
    const info = await FileSystem.getInfoAsync(imageUri);
    console.log('File exists:', info.exists, info.uri);
    const response = await axiosInstance.post('/playlist/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getPlaylists = async () => {
  const res = await axiosInstance.get('/playlist/getPlaylists');
  return res.data;
};

export const getPlaylistTracks = async (playlistId) => {
  const res = await axiosInstance.get('/playlist/getPlaylistTracks', {
    params: { playlistId },
  });
  return res.data;
};

