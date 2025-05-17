import React, { useState } from 'react';
import {
    Image,
    Platform, StatusBar as RNStatusBar, SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import '../../global.css';
export default function TabSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cố định */}
      <View className='bg-[#000]'>
        <View className='flex-row items-center justify-start px-4'>
          {/* Logo */}
          <Image
            source={require('../../assets/images/MSlogo.png')}
            style={{
            width: 60,
            height: 60,
            }}
        />
          <Text className='text-[#fff] text-2xl font-bold'>Search</Text>
        </View>
        <View className='pt-2 w-full bg-[#000] px-4'>
        {/* <FontAwesome name="search" size={28} color="#aaa"  style={styles.icon}/> */}
        <TextInput
          className='bg-[#222] rounded-lg pr-3 py-2 text-[#000] pl-12 text-xl'
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text className='text-[#fff] pt-2 pb-3 text-xl mt-5 z-10'>Search result for: {searchQuery}</Text>
      </View>
      </View>      

      {/* Nội dung kết quả tìm kiếm */}
      <ScrollView className=' px-4 pt-5 pb-10 bg-[#000] max-h-full' >
        
        {[...Array(30)].map((_, i) => (
          <Text key={i} className='text-[#fff] text-base mb-3'>
            • Result #{i + 1}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Tính chiều cao status bar an toàn
const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;
const HEADER_HEIGHT = 40;
const SEARCH_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: STATUS_BAR_HEIGHT + 10,
  },
  header: {
    height: HEADER_HEIGHT + SEARCH_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT + 20,
    width: '100%',
    backgroundColor: '#111',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },

});
