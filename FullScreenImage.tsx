import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ImageViewer from 'react-native-image-zoom-viewer';
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
});

export default FullScreenImageScreen;
