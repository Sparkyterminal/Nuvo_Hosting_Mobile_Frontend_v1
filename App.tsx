import React, { useEffect } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

// keep the splash visible while we load
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      // simulate resource loading or setup
      await new Promise((resolve) => setTimeout(resolve, 500));
      // hide Expo splash once ready
      await ExpoSplashScreen.hideAsync();
    };

    prepare();
  }, []);

  const [loaded] = useFonts({
    HelveticaNowThin: require('./src/assets/fonts/HelveticaNowDisplay-Thin.ttf'),
    HelveticaNowLight: require('./src/assets/fonts/HelveticaNowDisplay-Light.ttf'),
    HelveticaNowRegular: require('./src/assets/fonts/HelveticaNowDisplay-Regular.ttf'),
    HelveticaNowMedium: require('./src/assets/fonts/HelveticaNowDisplay-Medium.ttf'),
    HelveticaNowBold: require('./src/assets/fonts/HelveticaNowDisplay-Bold.ttf'),
    HelveticaNowExtraBold: require('./src/assets/fonts/HelveticaNowDisplay-ExtraBold.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
