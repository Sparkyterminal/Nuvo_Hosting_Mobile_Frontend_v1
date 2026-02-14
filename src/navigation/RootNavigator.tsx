import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LooginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import HomeTabsNavigator from './HomeTabsNavigator';
import ThemesScreen from '../screens/Home/ThemesScreen';
import ThemeDetailsScreen from '../screens/Home/ThemeDetailsScreen';
import BookEventFlowScreen from '../screens/Home/BookEventFlowScreen';

type ThemeCard = {
  id: string;
  title: string;
  description: string;
  image: any;
  color: string;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: undefined;
  Home: undefined;
  Themes: undefined;

  ThemeDetails: { theme: ThemeCard };
  BookEventFlow: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
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
            {/* Home now shows the bottom tabs */}
            <Stack.Screen
              name="Home"
              component={HomeTabsNavigator}
            />

            <Stack.Screen
              name="Themes"
              component={ThemesScreen}
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
