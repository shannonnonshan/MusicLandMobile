// lib/mockPlaylists.ts

export const initialPlaylist = [
  {
    id: '1',
    name: 'Lofi Chill',
    description: 'Relax and focus with these lofi beats.',
    coverImage: 'https://i1.sndcdn.com/artworks-000661837984-ax2e2h-t500x500.jpg',
    colors: ['#4c669f', '#3b5998'],
    songs: [
      {
        id: '101',
        title: 'Evening Vibes',
        artist: 'LoBee',
        duration: 180,
        uri: 'https://www.example.com/audio/evening-vibes.mp3',
        liked: false,
      },
      {
        id: '102',
        title: 'Study Time',
        artist: 'ZenMaster',
        duration: 210,
        uri: 'https://www.example.com/audio/study-time.mp3',
        liked: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Workout Energy',
    description: 'Pump up your energy with these high-tempo tracks.',
    coverImage: 'https://i.scdn.co/image/ab67706f000000029bbce1b191f9fa3d46c2b826',
    colors: ['#ff6f61', '#d72638'],
    songs: [
      {
        id: '201',
        title: 'Power Rush',
        artist: 'Beatz Mode',
        duration: 195,
        uri: 'https://www.example.com/audio/power-rush.mp3',
        liked: true,
      },
      {
        id: '202',
        title: 'Adrenaline',
        artist: 'FitBeats',
        duration: 205,
        uri: 'https://www.example.com/audio/adrenaline.mp3',
        liked: false,
      },
    ],
  },
  {
    id: '3',
    name: 'V-Pop Hits',
    description: 'The hottest V-Pop tracks right now.',
    coverImage: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/5/8/0/f/580fc2f2fefbc6ed7f8b7d3ef528f206.jpg',
    colors: ['#7f00ff', '#e100ff'],
    songs: [
      {
        id: '301',
        title: 'Em Gì Ơi',
        artist: 'Jack & K-ICM',
        duration: 190,
        uri: 'https://www.example.com/audio/em-gi-oi.mp3',
        liked: true,
      },
      {
        id: '302',
        title: 'Hơn Cả Yêu',
        artist: 'Đức Phúc',
        duration: 220,
        uri: 'https://www.example.com/audio/hon-ca-yeu.mp3',
        liked: false,
      },
    ],
  },
  {
    id: '4',
    name: '90s Love Songs',
    description: 'Romantic classics from the golden 90s.',
    coverImage: 'https://i.scdn.co/image/ab67706c0000da84f78c9f6d4a8ffb5c285ef3d6',
    colors: ['#ff9a9e', '#fad0c4'],
    songs: [
      {
        id: '401',
        title: 'My Heart Will Go On',
        artist: 'Celine Dion',
        duration: 240,
        uri: 'https://www.example.com/audio/my-heart-will-go-on.mp3',
        liked: true,
      },
      {
        id: '402',
        title: 'I Will Always Love You',
        artist: 'Whitney Houston',
        duration: 270,
        uri: 'https://www.example.com/audio/i-will-always-love-you.mp3',
        liked: true,
      },
    ],
  },
];
