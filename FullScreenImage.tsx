import React, { useState, useEffect } from 'react';
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

  const addToFavorites = async (uri: string) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      if (!favorites.includes(uri)) {
        favorites.push(uri);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        Alert.alert('Added to Favorites', 'This image has been added to your favorites.');
      } else {
        Alert.alert('Already in Favorites', 'This image is already in your favorites.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        index={index}
        renderIndicator={() => <></>}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={() => addToFavorites(images[index].url)}
      >
        <Ionicons name="heart" size={32} color="white" />
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
