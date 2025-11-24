import React, { useEffect } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
