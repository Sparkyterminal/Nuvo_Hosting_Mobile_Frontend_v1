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

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: undefined;
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
  const isLoggedIn = true;
  const role = 'employee';
  // const role = '';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
        {/* {!isLoggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeTabsNavigator}
            />

            <Stack.Screen
              name="ThemeDetails"
              component={ThemeDetailsScreen}
            />

            <Stack.Screen
              name="BookEventFlow"
              component={BookEventFlowScreen}
            />
          </>

          
        )} */}

        {!isLoggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={
                role === 'employee' ? EmployeeTabsNavigator : HomeTabsNavigator
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
