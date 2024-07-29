import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

type AlbumScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Album'>;
type AlbumScreenRouteProp = RouteProp<RootStackParamList, 'Album'>;

interface Photo {
  uri: string;
  id: string;
}

interface AlbumScreenProps {
  navigation: AlbumScreenNavigationProp;
  route: AlbumScreenRouteProp;
}

const AlbumScreen: React.FC<AlbumScreenProps> = ({ navigation, route }) => {
  const { albumId, title } = route.params;
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    (async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({ album: albumId, mediaType: 'photo' });
      const sortedPhotos = assets.sort((a, b) => b.creationTime - a.creationTime);
      setPhotos(sortedPhotos.map((asset) => ({
        uri: asset.uri,
        id: asset.id,
      })));
    })();
  }, [albumId]);

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FullScreenImage', { uri: item.uri })}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
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
  },
});

export default AlbumScreen;
