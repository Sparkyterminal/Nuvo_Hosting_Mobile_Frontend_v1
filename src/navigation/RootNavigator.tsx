import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LooginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import HomeTabsNavigator from './HomeTabsNavigator';
import ThemeDetailsScreen from '../screens/Home/ThemeDetailsScreen';
import BookEventFlowScreen from '../screens/Home/BookEventFlow/BookEventFlowScreen';
import EmployeeTabsNavigator from './EmployeeTabsNavigator';
import EventHistoryScreen from '../screens/EmployeeScreen/EventHistoryScreen';

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: {
    email: string;
  };
  Home: undefined;
  Themes: undefined;
  EventHistory: undefined;

  ThemeDetails: {
    data: {
      id: string | number;
      title: string;
      description?: string;
      image: any;
      color?: string;
    };
  };

  BookEventFlow: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // const isLoggedIn = false;
  // // const role = 'employee';
  // const role = '';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const loadAuth = async () => {
      const login = await AsyncStorage.getItem('isLoggedIn');
      const storedRole = await AsyncStorage.getItem('role');

      setIsLoggedIn(login === 'true');
      setRole(storedRole || '');
    };

    loadAuth();
  }, []);
  return (
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     <Stack.Screen
    //       name="Splash"
    //       component={SplashScreen}
    //     />

    //     {!isLoggedIn ? (
    //       <>
    //         <Stack.Screen
    //           name="Onboarding"
    //           component={OnboardingScreen}
    //         />
    //         <Stack.Screen
    //           name="Login"
    //           component={LooginScreen}
    //         />
    //         <Stack.Screen
    //           name="Register"
    //           component={RegisterScreen}
    //         />
    //         <Stack.Screen
    //           name="OtpVerification"
    //           component={OtpVerificationScreen}
    //         />
    //       </>
    //     ) : (
    //       <>
    //         <Stack.Screen
    //           name="Home"
    //           component={
    //             role === 'STAFF' || role === 'MAKEUP_ARTIST'
    //               ? EmployeeTabsNavigator
    //               : HomeTabsNavigator
    //           }
    //         />

    //         <Stack.Screen
    //           name="ThemeDetails"
    //           component={ThemeDetailsScreen}
    //         />
    //         <Stack.Screen
    //           name="BookEventFlow"
    //           component={BookEventFlowScreen}
    //         />
    //         <Stack.Screen
    //           name="EventHistory"
    //           component={EventHistoryScreen}
    //         />
    //       </>
    //     )}
    //   </Stack.Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="Login"
          component={LooginScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />

        <Stack.Screen
          name="Home"
          component={
            role === 'STAFF' || role === 'MAKEUP_ARTIST'
              ? EmployeeTabsNavigator
              : HomeTabsNavigator
          }
        />

        <Stack.Screen
          name="ThemeDetails"
          component={ThemeDetailsScreen}
        />
        <Stack.Screen
          name="BookEventFlow"
          component={BookEventFlowScreen}
        />
        <Stack.Screen
          name="EventHistory"
          component={EventHistoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
