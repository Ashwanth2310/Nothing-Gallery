import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type GalleryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gallery'>;

interface Photo {
  uri: string;
  id: string;
  // Add other properties from MediaLibrary.Asset as needed
}

// Define the Props interface for the GalleryScreen component
interface GalleryScreenProps {
  navigation: GalleryScreenNavigationProp; // Injected by React Navigation
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const { assets } = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
        const sortedPhotos = assets.sort((a, b) => b.creationTime - a.creationTime);
        setPhotos(sortedPhotos.map((asset) => ({
          uri: asset.uri,
          id: asset.id,
        })));
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FullScreenImage', { uri: item.uri })}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container}
    />
  );
};

const { width } = Dimensions.get('window');
const imageSize = width / 3 - 4;

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: 'black',
  },
  thumbnail: {
    width: imageSize,
    height: imageSize,
    margin: 4,
  },
});

export default GalleryScreen;
