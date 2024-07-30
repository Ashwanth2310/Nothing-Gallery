import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, Text, SectionList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

interface Photo {
  uri: string;
  id: string;
  creationTime: number;
}

interface SectionData {
  title: string;
  data: Photo[];
}

type TimelineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Timeline'>;

const TimelineScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const navigation = useNavigation<TimelineScreenNavigationProp>();

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
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 1000,
      });

      const groupedPhotos = assets.reduce((acc, photo) => {
        const date = new Date(photo.creationTime).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          uri: photo.uri,
          id: photo.id,
          creationTime: photo.creationTime,
        });
        return acc;
      }, {} as Record<string, Photo[]>);

      const sectionsData = Object.keys(groupedPhotos).map(date => ({
        title: date,
        data: groupedPhotos[date],
      }));

      setPhotos(assets.map(asset => ({
        uri: asset.uri,
        id: asset.id,
        creationTime: asset.creationTime,
      })));
      setSections(sectionsData);
    })();
  }, []);

  const handlePress = (photo: Photo) => {
    navigation.navigate('FullScreenImage', {
      photos: photos,
      index: photos.findIndex(p => p.id === photo.id),
    });
  };

  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title, data } }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
        renderItem={() => null} // No need to render individual items here
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
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
  sectionHeader: {
    padding: 5,
    backgroundColor: 'black',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontFamily: "nothing"
  },
  row: {
    justifyContent: 'flex-start',
  },
  thumbnail: {
    width: imageSize,
    height: imageSize,
    margin: 4,
    borderRadius:8
  },
});

export default TimelineScreen;
