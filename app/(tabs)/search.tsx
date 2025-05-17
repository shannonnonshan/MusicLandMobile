import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Image,
    Platform, StatusBar as RNStatusBar, SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'; // ✅ Đổi tên để không nhầm với expo-status-bar

export default function TabSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header cố định */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../../assets/images/MSlogo.png')}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Search</Text>
        </View>
      </View>

      {/* Thanh tìm kiếm cố định */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Nội dung kết quả tìm kiếm */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.resultText}>Search result for: {searchQuery}</Text>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.resultItem}>
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
const HEADER_HEIGHT = 80;
const SEARCH_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: HEADER_HEIGHT,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT+20,
    width: '100%',
    backgroundColor: '#111',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT + 20,
    width: '100%',
    backgroundColor: 'rgba(30,30,30,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  content: {
    paddingTop: HEADER_HEIGHT + SEARCH_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  resultItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
});
