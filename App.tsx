import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from './Gallery';
import FullScreenImageScreen from './FullScreenImage';
import AlbumScreen from './AlbumScreen';
import TimelineScreen from './Timeline'; 
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export type RootStackParamList = {
  Gallery: undefined;
  Album: { albumId: string, title: string };
  FullScreenImage: { uri: string };
  Timeline: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Gallery">
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{
            title: 'Albums',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTitleStyle: {
              fontFamily: 'nothing',
              fontSize: 30,
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTitleStyle: {
              fontFamily: 'nothing',
              fontSize: 30,
            },
            headerTintColor: 'white',
          })}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Timeline"
          component={TimelineScreen} 
          options={{
            title: 'Timeline',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTitleStyle: {
              fontFamily: 'nothing',
              fontSize: 30,
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
