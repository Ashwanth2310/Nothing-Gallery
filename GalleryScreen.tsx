import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type GalleryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gallery'>;

interface Album {
  id: string;
  title: string;
  thumbnailUri: string | null;
}

// Define the Props interface for the GalleryScreen component
interface GalleryScreenProps {
  navigation: GalleryScreenNavigationProp; // Injected by React Navigation
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
        const imageAlbums = await Promise.all(fetchedAlbums.map(async (album) => {
          const { assets } = await MediaLibrary.getAssetsAsync({
            album: album.id,
            mediaType: 'photo',
            first: 1
          });
          if (assets.length > 0) {
            // Get the latest image in the album
            const latestImage = assets[assets.length - 1];
            return {
              id: album.id,
              title: album.title,
              thumbnailUri: latestImage.uri,
            };
          }
          return null;
        }));

        // Filter out albums that have no images
        setAlbums(imageAlbums.filter((album): album is Album => album !== null));
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: Album }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Album', { albumId: item.id, title: item.title })}>
      <View style={styles.albumContainer}>
        {item.thumbnailUri ? (
          <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnail} />
        )}
        <Text style={styles.albumTitle}>{item.title} </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={albums}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const imageSize = width / 3 - 4;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    padding: 2,
  },
  albumContainer: {
    alignItems: 'center',
    margin: 4,
  },
  thumbnail: {
    width: imageSize,
    height: imageSize,
    backgroundColor: '#cccccc',
  },
  albumTitle: {
    color: 'white',
    marginTop: 4,
  },
});

export default GalleryScreen;
