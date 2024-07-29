import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Text ,Button} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";


type GalleryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gallery'>;

interface Album {
  id: string;
  title: string;
  thumbnailUri: string | null;
}

interface GalleryScreenProps {
  navigation: GalleryScreenNavigationProp; 
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [fontsLoaded, error] = useFonts({
    "nothing": require("./assets/fonts/nothingfont.otf")
  });

  React.useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
        const imageAlbums: (Album | null)[] = await Promise.all(fetchedAlbums.map(async (album) => {
          const { assets } = await MediaLibrary.getAssetsAsync({
            album: album.id,
            mediaType: 'photo',
            first: 1000,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]], 
          });
          if (assets.length > 0) {
            const latestImage = assets[0]; 
            return {
              id: album.id,
              title: album.title,
              thumbnailUri: latestImage.uri,
            } as Album;
          }
          return null;
        }));
  
        setAlbums(imageAlbums.filter((album): album is Album => album !== null) as Album[]);
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
      <Button
        title="Go to Timeline"
        onPress={() => navigation.navigate('Timeline')}
        color="grey"
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
    fontFamily:"nothing",
  },
});

export default GalleryScreen;
