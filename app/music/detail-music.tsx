import { useMusicContext } from '@/contexts/MusicContext';
import { Entypo } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


const loadFonts = () =>
  Font.loadAsync({
    'Lexend-SemiBold': require('@/assets/fonts/lexend_semibold.ttf'),
  });

export const options = {
  headerShown: false,
};

export default function TabMusicPlayingScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { currentSong } = useMusicContext();

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#191A1F]">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <>


      <View className="flex-1 bg-[#191A1F] p-4">
        {/* Scrollable Lyrics */}
        <ScrollView
          className="flex-1 mx-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text
            className="text-white text-lg leading-7 tracking-wide"
            style={{ fontFamily: 'Lexend-SemiBold' }}
          >
            {`oh lost\nlost in the words that we scream\n
I don't even wanna do this anymore\n
'cause you already know\n
What you mean to me\n
And our love's the only one\n
worth fighting for\n
Wherever you go\n
that's where I'll follow\n
Nobody's promised tomorrow\n
So I'ma love you every night like\n
It's the last night\n
Like it's the last night\n
If the world was ending\n
I'd wanna be next to you\n
If the party was over\n
And our time on Earth was through\n
I'd wanna hold you just for a while\n
And die with a smile\n
If the world was ending\n
I'd wanna be next to you`}
          </Text>
        </ScrollView>

        <View className="h-[66px] pb-2 relative mb-3">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-5 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 p-2"
          >
            <Entypo name="chevron-small-left" size={20} color="white" />
          </Pressable>

          {/* Song Title & Artist */}
          <View className="absolute top-1/2 left-0 right-0 -translate-y-1/2 items-center">
            <Text className="text-white text-lg font-bold">
              {currentSong?.title}
            </Text>
            <Text className="text-[#CCCCCC] text-base">
              {currentSong?.artist}
            </Text>
          </View>

          {/* Menu Button */}
          <Pressable className="absolute right-5 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 p-2">
            <Entypo name="add-to-list" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
