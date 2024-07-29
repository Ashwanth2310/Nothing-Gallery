import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type FullScreenImageScreenRouteProp = RouteProp<RootStackParamList, 'FullScreenImage'>;
type FullScreenImageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FullScreenImage'>;

type Props = {
  route: FullScreenImageScreenRouteProp;
  navigation: FullScreenImageScreenNavigationProp;
};

const FullScreenImageScreen: React.FC<Props> = ({ route, navigation }) => {
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
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
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
});

export default FullScreenImageScreen;