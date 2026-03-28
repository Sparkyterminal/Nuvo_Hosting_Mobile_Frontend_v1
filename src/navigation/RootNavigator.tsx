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
import { useAppDispatch } from '../store/hooks';
import { getCurrentUser } from '../services/api/userService';
import { setUser } from '../features/auth/authSlice';

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

  const dispatch = useAppDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  // useEffect(() => {
  //   const loadAuth = async () => {
  //     const login = await AsyncStorage.getItem('isLoggedIn');
  //     const storedRole = await AsyncStorage.getItem('role');

  //     setIsLoggedIn(login === 'true');
  //     setRole(storedRole || '');
  //   };

  //   loadAuth();
  // }, []);

  // useEffect(() => {
  //   const loadAuth = async () => {
  //     const login = await AsyncStorage.getItem('isLoggedIn');
  //     const storedRole = await AsyncStorage.getItem('role');

  //     setIsLoggedIn(login === 'true');
  //     setRole(storedRole || '');

  //     // ✅ if logged in → fetch profile
  //     if (login === 'true') {
  //       try {
  //         const res = await getCurrentUser();

  //         const userData = res?.data;

  //         // 🔥 store in redux
  //         dispatch(setUser(userData));

  //         // 💾 store in async storage
  //         await AsyncStorage.setItem('user', JSON.stringify(userData));

  //         // optional: sync role
  //         if (userData?.role) {
  //           await AsyncStorage.setItem('role', userData.role);
  //           setRole(userData.role);
  //         }
  //       } catch (error) {
  //         console.log('Profile error:', error);
  //       }
  //     }
  //   };

  //   loadAuth();
  // }, []);

  useEffect(() => {
    const loadAuth = async () => {
      const login = await AsyncStorage.getItem('isLoggedIn');
      const storedRole = await AsyncStorage.getItem('role');
      const storedUser = await AsyncStorage.getItem('user');

      setIsLoggedIn(login === 'true');
      setRole(storedRole || '');

      // ✅ STEP 1: Load from storage FIRST (instant UI)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      }

      // ✅ STEP 2: Then refresh from API (latest data)
      if (login === 'true') {
        try {
          const res = await getCurrentUser();
          const userData = res?.data;

          // update redux
          dispatch(setUser(userData));

          // update storage
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          // update role if needed
          if (userData?.role) {
            await AsyncStorage.setItem('role', userData.role);
            setRole(userData.role);
          }
        } catch (error) {
          console.log('Profile refresh error:', error);
        }
      }
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
