import * as FileSystem from 'expo-file-system';
import axiosInstance from './platform.api';
export const fetchPlaylists = async () => {
  const res = await axiosInstance.get('/playlist');
  return res.data;
};

export const createPlaylist = async ({ name, deviceId, imageUri }) => {
  try{
  const formData = new FormData();
  formData.append('name', name);
  formData.append('deviceId', deviceId);

  if (imageUri) {
    const fileName = imageUri.split('/').pop() || 'image.jpg';
    const fileType = fileName.split('.').pop();


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
  }
  );
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  
};

export const getPlaylists = async (deviceId) => {
  const res = await axiosInstance.get('/playlist/getPlaylists', {
    params: { deviceId }
  });
  return res.data;
};

export const getPlaylistTracks = async (playlistId) => {
  const res = await axiosInstance.get('/playlist/getPlaylistTracks', {
    params: { playlistId },
  });
  return res.data;
};

export const addSongToPlaylist = async (playlistId, songIds) => {
  const res = await axiosInstance.post('/playlist/addSongToPlaylist', {
    playlistId,
    songIds,   // gửi mảng songIds
  });
  return res.data;
};



