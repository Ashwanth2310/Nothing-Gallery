import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  const fetchPhotos = async (page: number) => {
    try {
      const { assets, totalCount } = await MediaLibrary.getAssetsAsync({
        album: albumId,
        mediaType: 'photo',
        first: 100, 
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        
      });
      if (assets.length > 0) {
        setPhotos((prevPhotos) => [...prevPhotos, ...assets.map((asset) => ({
          uri: asset.uri,
          id: asset.id,
        }))]);
        if (assets.length < 100 || (page + 1) * 100 >= totalCount) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FullScreenImage', { uri: item.uri })}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.container}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
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
