import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Photo {
  uri: string;
  id: string;
}

const FavoritesScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem('favorites');
        const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
        const photosArray = favorites.map((uri: string) => ({ uri, id: uri }));
        setPhotos(photosArray.reverse()); 
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const renderItem = ({ item }: { item: Photo }) => (
    <Image source={{ uri: item.uri }} style={styles.thumbnail} />
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={photos}
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
  thumbnail: {
    width: imageSize,
    height: imageSize,
    margin: 4,
    borderRadius: 8,
  },
});

export default FavoritesScreen;
