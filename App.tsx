import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from './GalleryScreen';
import FullScreenImageScreen from './FullScreenImageScreen';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";


export type RootStackParamList = {
  Gallery: undefined;
  FullScreenImage: { uri: string };
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
            title: 'Nothing Gallery',
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
        <Stack.Screen name="FullScreenImage" component={FullScreenImageScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
