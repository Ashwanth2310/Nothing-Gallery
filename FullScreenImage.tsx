import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './App';

type FullScreenImageScreenRouteProp = RouteProp<RootStackParamList, 'FullScreenImage'>;
type FullScreenImageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FullScreenImage'>;

type Props = {
  route: FullScreenImageScreenRouteProp;
  navigation: FullScreenImageScreenNavigationProp;
};

const FullScreenImageScreen: React.FC<Props> = ({ route, navigation }) => {
  const { photos, index } = route.params;

  const images = photos.map((photo: { uri: string }) => ({
    url: photo.uri,
  }));

  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem('favorites');
        const favoritesList = existingFavorites ? JSON.parse(existingFavorites) : [];
        setFavorites(favoritesList);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    setIsFavorited(favorites.includes(images[currentIndex].url));
  }, [currentIndex, favorites]);

  const toggleFavorite = useCallback(async (uri: string) => {
    try {
      let updatedFavorites = [...favorites];
      if (isFavorited) {
        updatedFavorites = updatedFavorites.filter(favorite => favorite !== uri);
        Alert.alert('Removed from Favorites', 'This image has been removed from your favorites.');
      } else {
        updatedFavorites.push(uri);
        Alert.alert('Added to Favorites', 'This image has been added to your favorites.');
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  }, [favorites, isFavorited]);

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        index={currentIndex}
        onChange={(index) => {
          if (index !== undefined) {
            setCurrentIndex(index);
          }
        }}
        renderIndicator={() => <></>}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={() => toggleFavorite(images[currentIndex].url)}
      >
        <Ionicons 
          name={isFavorited ? "heart" : "heart-outline"} 
          size={32} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 30,
  },
});

export default FullScreenImageScreen;
